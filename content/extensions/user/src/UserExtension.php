<?php namespace Drafterbit\Extensions\User;

class UserExtension extends \Drafterbit\Base\Extension
{
    function boot()
    {
        //log entities
        foreach (
            [
                'user' => function($id){
                    if ($this['session']->get('user.id') == $id) {
                        $label = __('You');
                    } else {
                        $label = $this->model('@user\User')->getSingleBy('u.id', $id)['real_name'];
                    }

                    if($label) {
                        return '<a href="'.admin_url('user/edit/'.$id).'">'.$label.'</a>';
                    }
                    
                    return '<em>'.__('unsaved').'</em>';
                },
                'role' => function($id){
                    $label = $this->model('@user\Role')->getSingleBy('id', $id)['label'];

                    if($label) {
                        return '<a href="'.admin_url('user/roles/edit/'.$id).'">'.$label.'</a>';
                    }

                    return '<em>'.__('unsaved').'</em>';
                }

            ] as $entity => $formatter) {
                $this['log.formatter']->addEntityFormatter($entity, $formatter);
            }
    }

    public function getNav()
    {
        return [
            ['id'=>'users',   'label' => 'Users', 'order' => 3],
            ['parent'=>'users', 'id'=>'user', 'label' => 'User', 'href' => 'user', 'order' => 1],
            ['parent'=>'users', 'id'=>'roles', 'label' => 'Roles', 'href' => 'user/roles', 'order' => 2]
        ];
    }

    public function getPermissions()
    {
        return [ 'user' => [
            'user.view' => 'view user',
            'user.add' => 'add user',
            'user.edit' => 'edit user',
            'user.delete' => 'delete user',

            'roles.view' => 'view roles',
            'roles.add' => 'add roles',
            'roles.edit' => 'edit roles',
            'roles.delete' => 'delete roles'
        ]
        ];
    }
}
