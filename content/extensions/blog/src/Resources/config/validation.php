<?php return [

'blog' => [
    'title'    => ['label' => 'Title',     'rules' => ['not-empty'] ],
    'content'  => ['label' => 'Content',     'rules' => ['optional'] ],
    'slug'     => ['label' => 'Slug',     'rules' => ['not-empty', 'alpha-dash'] ],
    'tags'     => ['label' => 'Tags',     'rules' => ['optional'] ]
],

'comment' => [
    'name'      => ['label' => 'Name', 'rules' => ['not-empty']],
    'email'     => ['label' => 'Email', 'rules' => ['not-empty','email']],
    'url'       => ['label' => 'URL', 'rules' => ['optional']],
    'content'   => ['label' => 'Comment', 'rules' => ['optional']],
    'parent_id' => ['label' => '', 'rules' => ['not-empty']],
    'post_id'   => ['label' => '', 'rules' => ['not-empty']]
]

];
