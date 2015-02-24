<?php return [

'%admin%' => [
    'subRoutes' => [
        'blog' => [
            'subRoutes' => [
                '/'                  => ['controller' => '@blog\Blog::index',  'access' => 'post.view'],
                'edit/{id}'          => ['controller' => '@blog\Blog::edit',   'access' => 'post.view'],
                'data/{status}.json' => ['controller' => '@blog\Blog::filter', 'access' => 'post.view'],
                'save'               => ['controller' => '@blog\Blog::save',   'access' => 'post.edit',   'csrf' => true, 'log.after' => ['message' => ':user:%user_id% edited post :post:%id%']],
                'setting'            => ['controller' => '@blog\Blog::setting'],
                'trash'              => ['controller' => '@blog\Blog::trash',  'access' => 'post.delete', 'csrf' => true],
                'revision/{id}'      => ['controller' => '@blog\Blog::revision',  'access' => 'post.revision.view'],

                'comments' => ['controller' => '@blog\Comment::index', 'access' => 'comment.view'],
            ]
        ],

        'comments' => [
            'subRoutes' => [
                'data/{status}.json' => ['controller' => '@blog\Comment::filter', 'access' => 'comment.view'],
                'trash'              => ['controller' => '@blog\Comment::trash',  'access' => 'comment.delete',   'csrf' => true],
                'status'             => ['controller' => '@blog\Comment::status', 'access' => 'comment.view',     'csrf' => true],
                'quick-reply'        => ['controller' => '@blog\Comment::quickReply', 'access' => 'comment.view', 'csrf' => true],
                'quick-trash'        => ['controller' => '@blog\Comment::quickTrash', 'access' => 'comment.delete', 'csrf' => true],
            ]
        ]
    ]
],

'blog' => [
    'controller' => '@blog\Frontend::index'
],
    
'%blog_url_pattern%' => [
    'controller' => '@blog\Frontend::view',
    'methods' => 'get',
    'requirements' => [
        'yyyy' => '\d{4}',
        'mm' => '\d{2}',
        ]
    ],

'%blog_tag_url_pattern%' => [
    'controller' => '@blog\Frontend::tag',
    'methods' => 'get'
    ],

'blog/comment/submit' => ['controller' => '@blog\Comment::submit', 'methods' => 'post'],

'feed.xml' => ['controller' => '@blog\Frontend::feed'],

'%blog_author_url_pattern%' => [
    'controller' => '@blog\Frontend::author'
]

];
