<?php return [

'user' => [
    'username'  => ['label' => 'Username',     'rules' => ['not-empty', 'max-length=16']],
    'real-name' => ['label' => 'Real Name',    'rules' => ['not-empty']],
    'website'   => ['label' => 'Website',      'rules' => ['optional']],
    'bio'       => ['label' => 'Bio',          'rules' => ['optional', 'max-length=500']],
    'roles'     => ['label' => 'Role',         'rules' => ['not-empty']],
    'email'     => ['label' => 'Email',        'rules' => ['not-empty', 'email']],
    'password'  => ['label' => 'Password',     'rules' => ['optional']],
    'password-confirm'      => ['label' => 'Password Confirmation', 'rules' => ['optional', 'match=password']],
],

'roles' => [
    'name'        => ['label' => 'Role Name', 'rules' => ['not-empty']],
    'description' => ['label' => 'Description', 'rules' => ['optional', 'max-length=500']],
    'permission'  => ['label' => 'Permission', 'rules' => ['optional']]
]

];
