<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Monolog\Logger;
use Monolog\Handler\RotatingFileHandler;

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
    }
}