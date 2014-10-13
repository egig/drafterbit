<?php namespace Drafterbit\Extensions\User\Controllers;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Drafterbit\Extensions\System\Auth\Exceptions\UserNotAuthorizedException;
use Drafterbit\Extensions\System\Controller as BaseController;
use Drafterbit\Extensions\User\Models\User;
use Drafterbit\Extensions\User\Models\UsersGroup;
use Drafterbit\Extensions\User\Models\Auth as authModel;

class Auth extends BaseController {

	protected $placeBeforeLogin = '/';
	protected $authModel;

	public function __construct( User $user, UsersGroup $group, AuthModel $authModel)
	{
		$this->authModel = $authModel;
	}

	public function login()
	{
		$this->get('helper')->load('form');

		if ($post = $this->get('input')->post()) {

			$remember = false;
			if(isset($postData['remember-me'])) {
				$remember = true;
			}

			$redirectAfterLogin = admin_url('dashboard');
			if($this->get('input')->get('next')) {
				$redirectAfterLogin = urldecode($this->get('input')->get('next'));
			}

			try {
				
				$this->validate('login', $post);
				$this->authModel->doLogin($post['email'], $post['password'], $remember);
				
				return redirect($redirectAfterLogin);
			} catch (\Exception $e) {
				set('messages', [$e->getMessage()]);
			}
		}

		$this->get('asset')
			->css('@bootstrap_css')
			->css('@fontawesome', '@fontawesome')
			->css($this->publicPath('css/sign-in.css'))
			->js($this->publicPath('js/sign-in.js'));
		
		$jsFileName = $this->get('asset')->writeJs();
		$fileName = $this->get('asset')->writeCSS();
		
		$this->data['stylesheet'] = $fileName.'.css';
		$this->data['script'] = $jsFileName.'.js';

		return view();
	}

	public function logout()
	{
		$session = $this->get('session');

		$userId = $session->get('user.id');
		$userName = $session->get('user.name');
		
		$url = admin_url("user/edit/{$userId}");

		$session->clear();
		$session->invalidate();

		$response = new RedirectResponse(admin_url('login'));

		$cookies = $this->get('input')->cookies();
		
		foreach ($cookies as $key => $value) {
			$response->headers->clearCookie($key);
		}

		log_db("Logged out", "<a href='$url'>{$userName}</a>");

		return $response;
	}
}