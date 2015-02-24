<?php return [
    
    'up' => function() use ($app)
    {
        $schema = $app['db']->getSchemaManager()->createSchema();
        
        // system
        $system = $schema->createTable('#_system');
        $system->addColumn('id', 'integer', ['autoincrement' => true]);
        $system->addColumn('name', 'string', ['length' => 45]);
        $system->addColumn('value', 'text', ['notnull' => false]);
        $system->setPrimaryKey(['id']);
        $app['db']->getSchemaManager()->createTable($system);

        // log
        $logs = $schema->createTable('#_logs');
        $logs->addColumn('id', 'integer', ['autoincrement' => true]);
        $logs->addColumn('channel', 'string', ['length' => 45]);
        $logs->addColumn('level', 'integer');
        $logs->addColumn('message', 'text');
        $logs->addColumn('time', 'integer');
        $logs->addColumn('context', 'text');
        $logs->setPrimaryKey(['id']);
        $app['db']->getSchemaManager()->createTable($logs);

        // menus
        $menus = $schema->createTable('#_menus');
        $menus->addColumn('id', 'integer', ['autoincrement' => true]);
        $menus->addColumn('name', 'string', ['length' => 150]);
        $menus->setPrimaryKey(['id']);
        $app['db']->getSchemaManager()->createTable($menus);

        // menu-item
        $menuItems = $schema->createTable('#_menu_items');
        $menuItems->addColumn('id', 'integer', ['autoincrement' => true]);
        $menuItems->addColumn('label', 'string', ['length' => 150]);
        $menuItems->addColumn('link', 'string', ['length' => 255]);
        $menuItems->addColumn('page', 'string', ['length' => 255]);
        $menuItems->addColumn('sequence', 'integer');
        $menuItems->addColumn('type', 'integer');
        $menuItems->addColumn('menu_id', 'integer');
        $menuItems->addColumn('parent_id', 'integer');
        $menuItems->setPrimaryKey(['id']);
        $menuItems->addForeignKeyConstraint('#_menus', ['menu_id'], ['id']);
        $app['db']->getSchemaManager()->createTable($menuItems);

        // widget
        $widgets = $schema->createTable('#_widgets');
        $widgets->addColumn('id', 'integer', ['autoincrement' => true]);
        $widgets->addColumn('name', 'string', ['length' => 45]);
        $widgets->addColumn('title', 'string', ['length' => 150]);
        $widgets->addColumn('sequence', 'integer');
        $widgets->addColumn('position', 'string', ['length' => 45]);
        $widgets->addColumn('theme', 'string', ['length' => 45]);
        $widgets->addColumn('context', 'text');
        $widgets->setPrimaryKey(['id']);
        $app['db']->getSchemaManager()->createTable($widgets);
    },

    'down' => function()
    {

    }
];
