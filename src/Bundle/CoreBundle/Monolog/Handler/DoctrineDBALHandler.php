<?php

namespace drafterbit\Bundle\CoreBundle\Monolog\Handler;

use Monolog\Logger;
use Monolog\Handler\AbstractProcessingHandler;
use Doctrine\DBAL\DriverManager;

class DoctrineDBALHandler extends AbstractProcessingHandler
{
    private $initialized = false;
    private $connection;
    private $statement;
    private $logTable;
    private $container;

    /**
     * Handler constructor.
     *
     * @todo refactor this to be more clean
     */
    public function __construct($container, $level = Logger::DEBUG, $bubble = true)
    {
        $this->container = $container;

        // we need new connection
        $param['dbname'] = $this->container->getParameter('database_name');
        $param['user'] = $this->container->getParameter('database_user');
        $param['password'] = $this->container->getParameter('database_password');
        $param['host'] = $this->container->getParameter('database_host');
        $param['driver'] = $this->container->getParameter('database_driver');

        $this->connection = DriverManager::getConnection($param);
        parent::__construct($level, $bubble);
        $this->logTable = $this->getTableName();
    }

    public function write(array $record)
    {
        if (!$this->initialized) {
            $this->initialize();
        }

        $this->statement->execute(
            [
            'channel' => $record['channel'],
            'level' => $record['level'],
            'message' => $record['message'],
            'time' => $record['datetime']->format('U'),
            'context' => json_encode($record['context']),
            ]
        );
    }

    private function initialize()
    {
        $this->statement = $this->connection->prepare(
            'INSERT INTO '.$this->logTable.' (channel, level, message, time, context) VALUES (:channel, :level, :message, :time, :context)'
        );

        $this->initialized = true;
    }

    /**
     * Get log table name.
     *
     * @return string
     */
    public function getTableName()
    {
        return $this->container->get('doctrine')->getManager()
            ->getClassMetadata('CoreBundle:Log')->getTableName();
    }
}
