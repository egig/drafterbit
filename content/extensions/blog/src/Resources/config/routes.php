<?php return [

'%admin%' => [
    'routes' => [
        'posts' => [
            'routes' => [
                '/'                  => ['controller' => '@blog\Post::index',  'access' => 'post.view'],
                'edit/{id}'          => ['controller' => '@blog\Post::edit',   'access' => 'post.view'],
                'data/{status}.json' => ['controller' => '@blog\Post::filter', 'access' => 'post.view'],
                'save'               => ['controller' => '@blog\Post::save',   'access' => 'post.edit',   'csrf' => true, 'log.after' => ['message' => ':user:%user_id% edited post :post:%id%']],
                'setting'            => ['controller' => '@blog\Post::setting'],
                'trash'              => ['controller' => '@blog\Post::trash',  'access' => 'post.delete', 'csrf' => true],
                
                '{postid}/revisions' => ['controller' => '@blog\Revision::view',  'access' => 'post.revision.view'],
                'revision/clear'     => ['controller' => '@blog\Revision::clear'],
                'revision/revert'    => ['controller' => '@blog\Revision::revert'],

                'comments' => ['controller' => '@blog\Comment::index', 'access' => 'comment.view'],
            ]
        ],

        'comments' => [
            'routes' => [
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
