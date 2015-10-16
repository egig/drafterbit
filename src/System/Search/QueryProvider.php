<?php

namespace Drafterbit\System\Search;

use Symfony\Component\DependencyInjection\Container;

abstract class QueryProvider {

	/**
	 * The Contrainer.
	 *
	 * @var Container
	 */
	protected $container;

	/**
	 * The DatabaseConnection.
	 *
	 * @var Dovtrine\DBAL\Connection $connection
	 */
    protected $databaseConnection;

    /**
     * The constructor
     *
     * @param Container $container
     */    
    public function __construct($container)
    {
        $this->container = $container;
        $this->databaseConnection = $container->get('database_connection');
    }

    /**
     * Get the query to be executed during search
     *
     * @return Doctrine\DBAL\Query\QueryBuilder
     */
    abstract function getQuery();

     /**
     * Get the result formatter.
     *
     * @return
     */
    abstract function getResultFormatter(Container $container = null);
}