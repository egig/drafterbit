<?php return [
    
    'up' => function() use ($app)
    {
        $schema = $app['db']->getSchemaManager()->createSchema();
        
        // pages
        $pages = $schema->createTable('#_pages');
        $pages->addColumn('id', 'integer', ['autoincrement' => true]);
        $pages->addColumn('slug', 'string', ['length' => 150]);
        $pages->addColumn('title', 'string', ['length' => 150]);
        $pages->addColumn('content', 'text');
        $pages->addColumn('user_id', 'integer');
        $pages->addColumn('created_at', 'datetime');
        $pages->addColumn('updated_at', 'datetime');
        $pages->addColumn('deleted_at', 'datetime');
        $pages->addColumn('layout', 'string', ['length' => 45, 'default' => 'default.html']);
        $pages->addColumn('status', 'boolean');
        $pages->addForeignKeyConstraint('#_users', ['user_id'], ['id']);
        $pages->setPrimaryKey(['id']);
        $app['db']->getSchemaManager()->createTable($pages);
    },

    'down' => function()
    {

    }
];
