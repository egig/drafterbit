<?php

namespace Drafterbit\Bundle\SystemBundle\Model;

use Doctrine\DBAL\Connection;

class System
{
    /**
     * System table name
     *
     * @var string
     */
    protected $systemTable = 'drafterbit_system';

    /**
     * Database connection instance
     *
     * @var Doctrine\DBAL\Connection
     */
    protected $databaseConnection;

    /**
     * Resolved data;
     *
     * @var array
     */
    protected $data = [];

    /**
     * Constructor
     */
    public function __construct(Connection $connection)
    {
        $this->databaseConnection =  $connection;
        $this->initData();
    }

    private function initData()
    {
        $rows = $this->data = $this->databaseConnection
            ->createQueryBuilder()
            ->select('*')
            ->from($this->systemTable, $this->systemTable)
            ->execute()
            ->fetchAll();

        $data = [];

        foreach ($rows as $row) {
            $data[$row['key']] = $row['value'];
        }

        return $this->data = $data;
    }

    /**
     * Get a value by key
     */
    public function get($key, $default = null)
    {
        return isset($this->data[$key]) ? $this->data[$key] : $default;
    }

    /**
     * @todo cache this
     */
    private function getStatementForARow($key)
    {
        $query = $this->databaseConnection->createQueryBuilder();
        $query
            ->select('*')
            ->from($this->systemTable, $this->systemTable)
            ->where('`key` = :key')
            ->setParameter('key', $key);

        return $query->execute();
    }

    /**
     * Update system data on databse
     *
     * @param array $system
     */
    public function update($system)
    {
        foreach ($system as $key => $value) {
            if($this->isExists($key)) {
                $this->doUpdate($key, $value);
            } else {
                $this->insert($key, $value);
            }
        }
    }

    /**
     * Check if a key is exists
     *
     * @return  booelan
     */
    public function isExists($key)
    {
        $stmt = $this->getStatementForARow($key);

        return (boolean) $stmt->rowCount();
    }

    private function doUpdate($key, $value)
    {
        $this->databaseConnection->update($this->systemTable, ['`value`' => $value], ['`key`' => $key]);
    }

    public function insert($key, $value)
    {
        $this->databaseConnection->insert($this->systemTable, ['`value`' => $value, '`key`' => $key]);
    }
}