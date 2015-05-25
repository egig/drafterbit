<?php namespace Drafterbit\Extensions\User\Models;

use Drafterbit\Extensions\User\Auth\Exceptions\UserNotAuthorizedException;

class Auth extends \Drafterbit\Base\Model
{
    public function __construct()
    {
        $this->user = $this->model('@user\User');
        $this->role = $this->model('@user\Role');
    }

    public function doLogin($login, $password)
    {
        $user = filter_var($login, FILTER_VALIDATE_EMAIL) ?
            $this->user->getByEmail($login) :
            $this->user->getByUserName($login);

        if (!$user or !password_verify($password, $user['password']) or ($user['status'] != 1)) {
            throw new \RuntimeException(__("Incorrect Username/Email or Password"));
        }
        
        $this->registerSession($user);
    }

    /**
     * Set all required session during app run
     *
     * @param  object $user
     * @return void
     */
    private function registerSession($user)
    {
        $encrypter = $this['encrypter'];
        
        $userPermissions = $encrypter->encrypt(serialize($this->user->getPermissions($user['id'])));
        
        $session = $this['session'];
        $data = [
            'user.id' => $user['id'],
            'user.email' => $user['email'],
            'user.name' => $user['real_name'],
            'user.role_id' => $user['role_id'],
            'user.permissions' => $userPermissions,
            '_token' => sha1((string) microtime(true)),
        ];

        foreach ($data as $key => $value) {
            $session->set($key, $value);
        }
    }

    /**
     * Authenticate current active user
     *
     * @return boolean|Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function authenticate($request)
    {
        if ($this->isLoggedIn()) {
            return true;
        }

        $next = urlencode(base_url($request->getPathInfo()));
        return redirect(admin_url("login?next=$next"))->send();
    }

    /**
     * Restrict user to given access key
     *
     * @param  string $accessKey
     * @return void
     */
    public function restrict($accessKey)
    {
        if (!$this->userHasPermission($accessKey)) {
            throw new UserNotAuthorizedException("Access denied");
        }

        return true;
    }

    /**
     * Check if current user has a permission
     *
     * @param string $key;
     */
    public function userHasPermission($accessKey)
    {
        if(!$this->isLoggedIn()) {
            return false;
        }

        if($this->currentUserIsAdmin()) {
            return true;
        }

        $encrypter = $this['encrypter'];
        $session = $this['session'];

        $userPermissions = unserialize($encrypter->decrypt($session->get('user.permissions')));

        return in_array($accessKey, $userPermissions);
    }

    /**
     * Check if there is a logged in user
     *
     * @return boolean
     */
    public function isLoggedIn()
    {
        return $this['session']->get('user.id');
    }

    /**
     * Check if current user is a superadmin
     *
     * @return boolean
     */
    public function currentUserIsAdmin()
    {
        $role_id = $this['session']->get('user.role_id');
        $role = $this->role->getSingleBy('id', $role_id);

        return $role['label'] == $this['config']['auth.admin_role'];
    }
}