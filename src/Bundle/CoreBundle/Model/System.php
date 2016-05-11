<?php

namespace drafterbit\Bundle\CoreBundle\Model;

use Doctrine\DBAL\Connection;

class System
{
    /**
     * System table name.
     *
     * @var string
     */
    protected $systemTable;

    /**
     * Database connection instance.
     *
     * @var Doctrine\DBAL\Connection
     */
    protected $databaseConnection;

    /**
     * Resolved data;.
     *
     * @var array
     */
    protected $data = [];

    /**
     * Constructor.
     */
    public function __construct($container)
    {
        $this->databaseConnection = $container->get('database_connection');

        $this->systemTable = $container->get('doctrine')->getManager()
            ->getClassMetadata('CoreBundle:System')->getTableName();
    }

    public function setConnection(Connection $connection)
    {
        $this->databaseConnection = $connection;
    }

    /**
     * Get system data from database.
     *
     * @return array
     */
    private function getData()
    {
        if ($this->data) {
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
        } catch (\Exception $e) {

            // Doctrine DBAL Exception not contains proper message
            // So we will just grab the PDOException instead
            if ($e instanceof \Doctrine\DBAL\DBALException) {
                $e = $e->getPrevious();
            }

            // Either database credential not valid or system table not exists
            // We will return empty data/array due to installation issue
            // @todo determine the effect to application behaviour
            if ($e instanceof \PDOException) {
                return [];
            }

            throw $e;
        }
    }

    /**
     * Get a value by key.
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
     * Update system data on databse.
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
     * Check if a key is exists.
     *
     * @return booelan
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

    /**
     * Set a value of a key.
     *
     * @param mixed
     */
    public function set($key, $value)
    {
        if ($this->isExists($key)) {
            $this->doUpdate($key, $value);
        } else {
            $this->insert($key, $value);
        }
    }

    public function insert($key, $value)
    {
        $this->databaseConnection->insert($this->systemTable, ['`value`' => $value, '`key`' => $key]);
        $this->data = [];
    }

    public static function deNotated(&$arr, $path, $value)
    {
        $keys = explode('.', $path);

        while ($key = array_shift($keys)) {
            $arr = &$arr[$key];
        }

        $arr = $value;
    }

    /**
     * Get an item from an array using "dot" notation.
     *
     * @param array  $array
     * @param string $key
     * @param mixed  $default
     *
     * @return mixed
     */
    public static function getNotated($array, $key, $default = null)
    {
        if (is_null($key)) {
            return $array;
        }

        if (isset($array[$key])) {
            return $array[$key];
        }

        foreach (explode('.', $key) as $segment) {
            if (!is_array($array) || !array_key_exists($segment, $array)) {
                return $default;
            }

            $array = $array[$segment];
        }

        return $array;
    }
}
