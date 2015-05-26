<?php

namespace Drafterbit\Bundle\SystemBundle\Search;

use Symfony\Component\DependencyInjection\Container;

abstract class QueryProvider {

	protected $databaseConnection;

	public function __construct($databaseConnection)
	{
		$this->databaseConnection = $databaseConnection;
	}

	abstract function getQuery();
	abstract function getResultFormatter(Container $container);
}