<?php return [
    [
        'name' => "PHP Version",
        'function' => function() {
            return version_compare($ver = PHP_VERSION, $req = '5.4.0', '>=');
        },
        'message' => 'You need to run PHP 5.5+ to get drafterbit running'
    ],
    [
        'name' => 'Cache Directory',
        'function' => function($app) {
            return is_writable($app['path.content'].'cache');
        },
        'message' => app('path.content')."cache directory is required to be writable"
    ],
    [
        'name' => 'Files Directory',
        'function' => function($app) {
            return is_writable($app['path.content'].'files');
        },
        'message' => app('path.content')."files directory is required to be writable"
    ],
    [
        'name' => 'PHP Mcrypt Exstension',
        'function' => function($app) {
            return function_exists("mcrypt_encrypt");
        },
        'message' => "PHP Mcrypt extension is required"
    ]
];