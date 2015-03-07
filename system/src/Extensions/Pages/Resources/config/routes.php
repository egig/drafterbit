<?php return [

    '%admin%' =>[
        'routes' => [
            'pages' => [
                'routes' => [
                    '/'                  => ['controller' => '@pages\Pages::index',  'access' => 'page.view'],
                    'edit/{id}'          => ['controller' => '@pages\Pages::edit',   'access' => 'page.view'],
                    'data/{status}.json' => ['controller' => '@pages\Pages::filter', 'access' => 'page.view'],
                    'save'               => ['controller' => '@pages\Pages::save',   'access' => 'page.edit',   'csrf' => true, 'log.after' => ['message' => ':user:%user_id% edited page :page:%id%']],
                    'trash'              => ['controller' => '@pages\Pages::trash',  'access' => 'page.delete', 'csrf' => true]
                ]
            ]
        ]
    ]
];
