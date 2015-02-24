<?php return [

    '%admin%' => [
        'before'    => '@user\Models\Auth::authenticate',
        'methods'   => 'get|post',
        'subRoutes' => [
            '/'         => ['controller' => '@system\System::dashboard'],
            'login'     => ['controller' => '@user\Auth::login'],
            'do_login'  => [
                'controller' => '@user\Auth::doLogin',
                'methods' => 'post',
                'log.after' => [
                    'type' => 1,
                    'message' => ':user:%user_id% logged in'
                ]
            ],
            'logout'    => [
                'controller' => '@user\Auth::logout',
                'log.before' => [
                    'type' => 1,
                    'message' => ':user:%user_id% logged out'
                ]
            ],
            'setting'   => [
                'subRoutes' => [
                    'general'   => [
                        'controller' => '@system\Setting::general',
                        'access' => 'system.change'
                    ],
                    'themes'    => [
                        'subRoutes' => [
                            '/'              => [
                                'controller' => '@system\Theme::index',
                                'access' => 'appearance.change'
                            ],
                            'customize'      => ['controller' => '@system\Theme::customize',     'csrf'=>true],
                            'custom-preview' => ['controller' => '@system\Theme::customPreview', 'csrf'=>true],
                            
                            'widget/save'    => ['controller' => '@system\Widget::save', 'methods' => 'post'],
                            'widget/delete'  => ['controller' => '@system\Widget::delete'],
                            'widget/sort'    => ['controller' => '@system\Widget::sort'],

                            'menus'          => ['controller' => '@system\Menus::index'],
                        ]
                    ]
                ]
            ],

            'system' => [
                'subRoutes' => [
                    'dashboard'      => ['controller' => '@system\System::dashboard'],
                    'dashboard/sort' => ['controller' => '@system\System::sortDashboard'],
                    'log'            => ['controller' => '@system\System::log',  'access' => 'log.view'],
                    'log-data.json'  => ['controller' => '@system\System::logData',  'access' => 'log.view'],
                    'cache'          => ['controller' => '@system\System::cache','access' => 'cache.view'],
                ],
            ],

            'menus' => [
                'subRoutes' => [
                    '/' => ['controller' => '@system\Menus::index'],
                    'add-item' => ['controller' => '@system\Menus::addItem'],
                    'sort' => ['controller' => '@system\Menus::sort'],
                    'item/save'     => ['controller' => '@system\Menus::itemSave', 'methods' => 'post'],
                    'item/delete'   => ['controller' => '@system\Menus::itemDelete'],
                    'delete'   => ['controller' => '@system\Menus::delete'],
                    'add'   => ['controller' => '@system\Menus::add'],
                ]
            ]
        ],
    ],

    'system/drafterbit.js' => ['controller' => '@system\System::drafterbitJs'],
    'system/session.js' => ['controller' => '@system\System::sessionjs'],
    'system/drafterbit.css' => ['controller' => '@system\System::drafterbitCss'],

    'search' => [
        'controller' => '@system\Frontend::search'
    ],

    // Trail-slash Redirector
    '{url}' => [
        'controller' => function($url){
            return redirect(base_url(rtrim($url, '/')), 301);
        },
        'requirements' => [
            'url' => ".*/$"
        ],
        'methods' => 'get'
    ]
];
