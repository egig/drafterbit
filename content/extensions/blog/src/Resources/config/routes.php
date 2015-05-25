<?php return [

'%admin%' => [
    'routes' => [
        'posts' => 'Drafterbit\\Blog\\Controllers\\Post',

        'posts/{postid}/revisions' => ['controller' => '@blog\Revision::view',  'access' => 'post.revision.view'],
        'posts/revision/clear'     => ['controller' => '@blog\Revision::clear'],
        'posts/revision/revert'    => ['controller' => '@blog\Revision::revert'],

        'posts/categories' => "Drafterbit\\Blog\\Controllers\\Category",
        'comments' => "Drafterbit\\Blog\\Controllers\\Comment"
    ]
],

'blog' => [
    'controller' => '@blog\Frontend::index'
],
    
'%blog_url%' => [
    'controller' => '@blog\Frontend::view',
    'methods' => 'get',
    'requirements' => [
        'yyyy' => '\d{4}',
        'mm' => '\d{2}',
        ]
    ],

'%blog_tag_url%' => [
    'controller' => '@blog\Frontend::tag',
    'methods' => 'get'
    ],

'%blog_cat_url%' => [
    'controller' => '@blog\Frontend::category',
    'methods' => 'get'
    ],

'blog/comment/submit' => ['controller' => '@blog\Comment::submit', 'methods' => 'post'],

'feed.xml' => ['controller' => '@blog\Frontend::feed'],

'%blog_author_url%' => [
    'controller' => '@blog\Frontend::author'
]

];
