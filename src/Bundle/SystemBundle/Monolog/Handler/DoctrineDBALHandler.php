<?php

namespace Drafterbit\Bundle\SystemBundle\Monolog\Handler;

use Monolog\Logger;
use Monolog\Handler\AbstractProcessingHandler;
use Doctrine\DBAL\DriverManager;

class DoctrineDBALHandler extends AbstractProcessingHandler
{
    private $initialized = false;
    private $connection;
    private $statement;
    private $logTable = 'drafterbit_log';

    /**
     * Handler constructor.
     *
     * @todo refactor this to be more clean
     */
    public function __construct(array $param, $level = Logger::DEBUG, $bubble = true)
    {
        $this->connection = DriverManager::getConnection($param);;
        parent::__construct($level, $bubble);
    }

    protected function write(array $record)
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
            'context' => json_encode($record['context'])
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
}