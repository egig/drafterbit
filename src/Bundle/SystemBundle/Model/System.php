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
    }

    public function setConnection(Connection $connection)
    {
        $this->databaseConnection =  $connection;
    }

    /**
     * @todo integrate this with installer
     */
    private function getData()
    {
        if($this->data) {
            return $this->data;
        }

        try {
            
            $rows = $this->data = $this->databaseConnection
                ->createQueryBuilder()
                ->select('*')
                ->from($this->systemTable, $this->systemTable)
                ->execute()
                ->fetchAll();

            $data = [];
            $merged = [];

            foreach ($rows as $row) {
                static::deNotated($data[$row['key']], $row['key'], $row['value']);
            }

            foreach (array_values($data) as $value) {
                $merged = array_merge_recursive($merged, $value);
            }

            return $this->data = $merged;
        } catch (\PDOException $e) {
            return [];
        }
    }

    /**
     * Get a value by key
     */
    public function get($key, $default = null)
    {
        return static::getNotated($this->getData(), $key, $default);
    }

    /**
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
            $this->databaseConnection->delete($this->systemTable, ['`key`' => $key]);
            $this->insert($key, $value);
        }

        $this->data = [];
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
        $this->data = [];
    }

    public function insert($key, $value)
    {
        $this->databaseConnection->insert($this->systemTable, ['`value`' => $value, '`key`' => $key]);
        $this->data = [];
    }

    public static function deNotated(&$arr, $path, $value) {
        $keys = explode('.', $path);

        while ($key = array_shift($keys)) {
            $arr = &$arr[$key];
        }

        $arr = $value;
    }

    /**
     * Get an item from an array using "dot" notation.
     *
     * @param  array   $array
     * @param  string  $key
     * @param  mixed   $default
     * @return mixed
     */
    public static function getNotated($array, $key, $default = null)
    {
        if (is_null($key)) return $array;

        if (isset($array[$key])) return $array[$key];

        foreach (explode('.', $key) as $segment)
        {
            if ( ! is_array($array) || ! array_key_exists($segment, $array))
            {
                return $default;
            }

            $array = $array[$segment];
        }

        return $array;
    }
}