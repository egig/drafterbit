<?php namespace Drafterbit\Extensions\User\Controllers;

use Drafterbit\Component\Validation\Exceptions\ValidationFailsException;
use Drafterbit\Extensions\System\BackendController;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\JsonResponse;

class User extends BackendController
{

    public function index()
    {
        $userIds = $this['input']->post('users');

        if ($userIds) {
            $action = $this['input']->post('action');

            switch($action) {
                case "Delete":
                    foreach ($userIds as $id) {
                        $this->model('@user\User')->delete($id);
                    }
                    message('Users deleted !', 'success');
                    break;
                default:
                    break;
            }
        }

        $data['id'] ='users';
        $data['title'] = __('Users');
        $data['action'] = admin_url('user/index-action');

        return $this->render('@user/admin/index', $data);
    }

    public function indexAction()
    {
        $post = $this['input']->post();

        $userIds = $post['users'];

        switch($post['action']) {
            case 'delete':
                $this->model('@user\User')->delete($userIds);
                break;
            default:
                break;
        }
    }

    public function filter($status)
    {
        $users = $this->model('@user\User')->all(['status' => $status]);
        
        $editUrl = admin_url('user/edit');

        $usersArr  = [];

        foreach ($users as $user) {
            $data = [];
            $data[] = $user['id'];
            $data[] = $user['real_name'];
            $data[] = $user['email'];
            $data[] = $user['status'] == 1 ? 'active' : 'banned';

            $usersArr[] = $data;
        }

        $ob = new \StdClass;
        $ob->data = $usersArr;
        $ob->recordsTotal= count($usersArr);
        $ob->recordsFiltered = count($usersArr);

        return $this->jsonResponse($ob);
    }

    public function save()
    {
        try {
            $postData = $this['input']->post();

            $this->validate('user', $postData);
            
            $id = $postData['id'];

            if ($id) {
                $updateData = $this->createUpdateData($postData);
                $this->model('@user\User')->update($updateData, ['id' => $id]);
            
            } else {
                $insertData = $this->createInsertData($postData);
                $id = $this->model('@user\User')->insert($insertData);
            }

            //insert roles
            $this->insertRoles($postData['roles'], $id);

            $data['id'] = $id;
            $data['message'] = 'User saved !';
            $data['status'] = 'success';

        } catch (ValidationFailsException $e) {
            $data['error'] = [
                'type' => 'validation',
                'messages' => $e->getMessages(),
            ];
        }

        return new JsonResponse($data);
    }

    public function edit($id = null)
    {
        if ($id == 'new') {
            $data = [
                'username' => null,
                'realName' => null,
                'email' => null,
                'url' => null,
                'bio' => null,
                'roleIds' => [],
                'status' => null,
                'userId' => null,
                'title' => __('New User')
            ];
        } else {
            $user = (object) $this->model('@user\User')->getSingleBy('u.id', $id);
            $user->roleIds = $this->model('@user\User')->getRoleIds($user->id);

            $data = [
                'username' => $user->username,
                'realName' => $user->real_name,
                'email' => $user->email,
                'url' => $user->url,
                'bio' => $user->bio,
                'roleIds' => $user->roleIds,
                'status' => $user->status,
                'userId' => $user->id,
                'title' => __('Edit User')
            ];
        }

        $roles = $this->model('@user\Role')->all();

        $data['roleOptions'] = $roles;
        $data['id'] = 'user-edit';
        $data['action'] = admin_url('user/save');
        
        return $this->render('@user/admin/edit', $data);
    }

    protected function insertRoles($roles, $id)
    {
        $this->model('@user\User')->clearRoles($id);

        foreach ($roles as $role) {
            $this->model('@user\User')->insertRole($role, $id);
        }
    }

    protected function createInsertData($post, $update = false)
    {
        $data = [];
        $data['email'] = $post['email'];
        $data['username'] = $post['username'];
        
        if (isset($post['password']) and trim($post['password']) !== '') {
            $data['password'] = password_hash($post['password'], PASSWORD_BCRYPT);
        }
        
        $data['bio'] = isset($post['bio']) ? $post['bio'] : null;
        $data['status'] = $post['status'];
        $data['url'] = isset($post['url']) ? $post['url'] : null;
        $data['real_name'] = isset($post['real-name']) ? $post['real-name'] : null;
        $data['updated_at'] = Carbon::Now();

        if (! $update) {
            $data['created_at'] = Carbon::Now();
        }

        return $data;
    }

    protected function createUpdateData($post)
    {
        return $this->createInsertData($post, true);
    }
}
