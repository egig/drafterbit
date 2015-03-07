<?php return [
    
    'up' => function () use ($app)
    {
        $schema = $app['db']->getSchemaManager()->createSchema();
        
        // posts
        $posts = $schema->createTable('#_posts');
        $posts->addColumn('id', 'integer', ['autoincrement' => true]);
        $posts->addColumn('slug', 'string', ['length' => 150]);
        $posts->addColumn('title', 'string', ['length' => 150]);
        $posts->addColumn('content', 'text');
        $posts->addColumn('type', 'string', ['length' => 20]);
        $posts->addColumn('user_id', 'integer');
        $posts->addColumn('created_at', 'datetime');
        $posts->addColumn('updated_at', 'datetime');
        $posts->addColumn('deleted_at', 'datetime');
        $posts->addColumn('published_at', 'datetime');
        $posts->addColumn('status', 'boolean');
        $posts->addForeignKeyConstraint('#_users', ['user_id'], ['id']);
        $posts->setPrimaryKey(['id']);
        $app['db']->getSchemaManager()->createTable($posts);

        // tags
        $tags = $schema->createTable('#_tags');
        $tags->addColumn('id', 'integer', ['autoincrement' => true]);
        $tags->addColumn('slug', 'string', ['length' => 45]);
        $tags->addColumn('label', 'string', ['length' => 45]);
        $tags->setPrimaryKey(['id']);
        $app['db']->getSchemaManager()->createTable($tags);

        //posts_tags
        $posts_tags = $schema->createTable('#_posts_tags');
        $posts_tags->addColumn('id', 'integer', ['autoincrement' => true]);
        $posts_tags->addColumn('post_id', 'integer');
        $posts_tags->addColumn('tag_id', 'integer');
        $posts_tags->setPrimaryKey(['id']);
        $posts_tags->addForeignKeyConstraint('#_posts', ['post_id'], ['id']);
        $posts_tags->addForeignKeyConstraint('#_tags', ['tag_id'], ['id']);
        $app['db']->getSchemaManager()->createTable($posts_tags);

        //comments
        $comments = $schema->createTable('#_comments');
        $comments->addColumn('id', 'integer', ['autoincrement' => true]);
        $comments->addColumn('content', 'text');
        $comments->addColumn('post_id', 'integer');
        $comments->addColumn('parent_id', 'integer');
        $comments->addColumn('name', 'string', ['length' => 45, 'notnull' => true]);
        $comments->addColumn('email', 'string', ['length' => 150, 'notnull' => true]);
        $comments->addColumn('url', 'string', ['length' => 150]);
        $comments->addColumn('created_at', 'datetime');
        $comments->addColumn('updated_at', 'datetime');
        $comments->addColumn('deleted_at', 'datetime');
        $comments->addColumn('subscribe', 'boolean');
        $comments->addColumn('status', 'boolean');
        $comments->setPrimaryKey(['id']);
        $comments->addForeignKeyConstraint('#_posts', ['post_id'], ['id']);
        $app['db']->getSchemaManager()->createTable($comments);
    },

    'down' => function ()
    {
        // delete tables
    }
];
