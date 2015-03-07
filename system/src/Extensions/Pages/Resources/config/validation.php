<?php return [
    'page' => [
        'title'     => ['label' => 'Title',     'rules' => ['not-empty'] ],
        'content'     => ['label' => 'Content',     'rules' => ['optional'] ],
        'slug'         => ['label' => 'Slug',         'rules' => ['not-empty', 'alpha-dash'] ],
        'layout'     => ['label' => 'Layout',     'rules' => ['not-empty'] ],
        'status'     => ['label' => 'Status',     'rules' => ['not-empty'] ]
    ]
];
