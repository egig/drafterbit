<?php namespace Drafterbit\Base\Provider;

use Monolog\Logger;
use Pimple\Container;
use Drafterbit\Base\Log\Formatter;
use Pimple\ServiceProviderInterface;
use Monolog\Handler\RotatingFileHandler;
use Drafterbit\Base\Log\DoctrineDBALHandler;

class LogServiceProvider implements ServiceProviderInterface {
    
    public function register(Container $app)
    {
        $app['log'] = function($c){
            $logger = new Logger('drafterbit.log'); 
            
            // By default we will build a rotating log file setup which
            // creates a new file each day and log error by default.
            $path = $c['path.log']."log-".php_sapi_name().".txt";
            $handler = new RotatingFileHandler($path, 0, Logger::DEBUG);
            $logger->pushHandler($handler);

            return $logger;
        };

        $app['log.formatter'] = function($c) {
            return new Formatter;
        };

        $app['log.db'] = function($c){
            $logger =  new Logger('db.log');
            $logger->pushHandler(new DoctrineDBALHandler($c['db']));
            
            $logger->pushProcessor(
                function ($record) {
                    $record['formatted'] = "%message%";
                    return $record;
                }
            );

            return $logger;
        };
    }
}