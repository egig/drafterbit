<?php namespace Drafterbit\Extensions\User\Controllers;

use Drafterbit\Component\Validation\Exceptions\ValidationFailsException;
use Drafterbit\Extensions\System\BackendController;

class Roles extends BackendController
{

    public function index()
    {
        // @todo disable editing for administrator
        $roles = $this->model('@user\Role')->all();
        
        $data['roles'] = $roles;

        $editUrl = admin_url('user/roles/edit');
        $tableHead = [
            ['field' => 'label', 'label' => 'Role', 'format' => function($value, $item) use ($editUrl)  {
                return "<a href='$editUrl/{$item['id']}'>$value</a>";
            }],
            ['field' => 'description', 'label' => 'Description']
        ];

        $data['id'] = 'roles';
        $data['title'] = __('Roles');
        $data['action'] = admin_url('user/roles/index-action');

        return $this->render('@user/admin/roles/index', $data);
    }

    public function indexAction()
    {

        $roles = $this['input']->post('roles');

        if (!$roles) {
            return $this->jsonResponse(
                [
                'message' => 'Please make selection',
                'status' => 'error'
                ]
            );
        }

        $action = $this['input']->post('action');

        switch($action) {
            case "delete":

                $freezed = [];
                $notfreezed = [];
                
                foreach ($roles as $role) {
                    if ($this->model('@user\Role')->getRoledUsers($role)) {
                        $freezed[] = $this->model('@user\Role')->getRoleName($role);
                    } else {
                        $notfreezed[] = $role;
                    }
                }

                if ($notfreezed) {
                    $this->model('@user\Role')->delete($notfreezed);
                }

                if (count($freezed) > 0) {
                    $message = 'Can not delete following roles: '.implode(', ', $freezed).'. Due to there are users roled by them';
                    $status = 'warning';
                } else {
                    $message = 'Selected roles was deleted';
                    $status = 'success';
                }

                break;
            default:
                break;
        }
        
        return $this->jsonResponse(['message' => $message, 'status' => $status]);
    }

    public function filter()
    {
        $roles = $this->model('@user\Role')->all();
        
        $editUrl = admin_url('user/roles/edit');

        $usersArr  = [];

        foreach ($roles as $role) {
            $data = [];
            $data[] = $role['id'];
            $data[] = $role['label'];
            $data[] = $role['description'];

            $usersArr[] = $data;
        }

        $ob = new \StdClass;
        $ob->data = $usersArr;
        $ob->recordsTotal= count($usersArr);
        $ob->recordsFiltered = count($usersArr);

        return $this->jsonResponse($ob);
    }

    public function edit($id = null)
    {
        $data['id'] = 'roles-edit';
        $data['permissions'] = $this['app']->getPermissions();

        $data['action'] = admin_url('user/roles/save');

        $data['roleId'] = $id;
        $data['adminRole'] = $this['config']['auth.admin_role'];

        if ($role = $this->model('@user\Role')->getsingleBy('id', $id)) {
            $data['roleName'] = $role['label'];
            $data['description'] = $role['description'];
            $data['permissionIds'] = $role['permissions'] ? json_decode($role['permissions'], true) : [];
            $data['title'] = __('Edit Role');
        } else {
            $data['roleName'] = null;
            $data['description'] = null;
            $data['permissionIds'] = [];
            $data['title'] = __('New Role');
        }

        $data['disabled'] = ($this['config']['auth.admin_role'] == $data['roleName']) ? 'disabled="disabled"': '';

        return $this->render('@user/admin/roles/edit', $data);
    }

    public function save()
    {
        $response = [];

            
        try {
            $posts = $this['input']->post();

            $this->validate('roles', $posts);

            //insert froup
            $data = $this->createRoleInsertData($posts);
            
            $id = $this->model('@user\Role')->save($posts['id'], $data);

            $response = [
                'message' => __('Role saved !'),
                'status' => 'success',
                'id' => $id
            ];

        } catch (ValidationFailsException $e) {
            $response['error'] = [
                'type' => 'validation',
                'messages' => $e->getMessages()
            ];
        }

        return $this->jsonResponse($response);
    }

    protected function createRoleInsertData($post)
    {
        $data = [];
        $data['label'] = $post['name'];
        $data['description'] = $post['description'];

        if (isset($post['permissions'])) {
            $data['permissions'] = json_encode($post['permissions']);
        }

        return $data;
    }
}
