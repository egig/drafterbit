<?php return [
    
    '%admin%' => [
        'auth'      => true,
        'methods'   => 'get|post',
        'routes'    => [
            '/'         => '@system\System::dashboard',
            'login'     => [
                'auth' => false,
                'controller'=>'@user\Auth::login'
            ],
            'do_login'  => [
                'auth' => false,
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

            'setting' => [
                'routes' => [
                    'general' => ['controller' => '@system\Setting::general', 'access' => 'system.change'], 
                    'themes'   => "Drafterbit\\Extensions\\System\\Controllers\\Theme",
                    'themes/widget' => "Drafterbit\\Extensions\\System\\Controllers\\Widget",
                ]
            ],
            
            'system' => 'Drafterbit\\Extensions\\System\\Controllers\\System',
            'menus' => 'Drafterbit\\Extensions\\System\\Controllers\\Menus'
        ],
    ],

    'system/drafterbit.js'  => '@system\Asset::drafterbitJs',
    'system/session.js'     => '@system\Asset::sessionjs',
    'system/drafterbit.css' => '@system\Asset::drafterbitCss',

    'search' => '@system\Frontend::search',

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
