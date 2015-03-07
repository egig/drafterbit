<?php namespace Drafterbit\Component\Database\Driver\PDOMySql;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Driver\PDOMySql\Driver as BaseDriver;

class Driver extends BaseDriver {
    
    /**
     * {@inheritdoc}
     */
    public function getSchemaManager(\Doctrine\DBAL\Connection $conn)
    {
        return new \Drafterbit\Component\Database\Schema\MySqlSchemaManager($conn);
    }
}