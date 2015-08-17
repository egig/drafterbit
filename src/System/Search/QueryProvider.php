<?php

namespace Drafterbit\System\Search;

use Symfony\Component\DependencyInjection\Container;

abstract class QueryProvider {

    protected $container;
    protected $databaseConnection;

    public function __construct($container)
    {
    	$this->container = $container;
        $this->databaseConnection = $container->get('database_connection');
    }

    abstract function getQuery();
    abstract function getResultFormatter(Container $container);
}