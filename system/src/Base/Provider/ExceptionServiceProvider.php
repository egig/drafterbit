<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Whoops\Handler\PrettyPageHandler;
use Whoops\Handler\JsonResponseHandler;
use Drafterbit\Component\Exception\PlainDisplayer;
use Drafterbit\Component\Exception\DebugDisplayer;
use Drafterbit\Component\Exception\Handler as ExceptionHandler;

class ExceptionServiceProvider implements ServiceProviderInterface {
    
    public function register(Container $app)
    {
         //Building
        $app['whoops'] = function($c){
            $whoops =  new \Whoops\Run;
            $whoops->pushHandler($c['whoops_handler']);
            $whoops->pushHandler($c['whoops_json_handler']);
            return $whoops;
        };

        $app['whoops_handler'] = function($c){
            $handler = new PrettyPageHandler();
            $handler->setPageTitle("Oops! There was a problem.");
            $handler->setResourcesPath($c->getResourcespath('whoops'));
            return $handler;
        };

        $app['whoops_json_handler'] = function($c) {
            $handler =  new JsonResponseHandler;
            $handler->onlyForAjaxRequests(true);
            return $handler;
        };

        $app['exception.displayer.debug'] = function($c) use ($app) {
            return new DebugDisplayer($c['whoops'], $app->runningInConsole());
        };

        $app['exception.displayer.plain'] = function($c){
            return new PlainDisplayer($c->getResourcespath('views/plain.html'));
        };

        $app['exception'] = function($c){
            return new ExceptionHandler(
                $c['exception.displayer.plain'],
                $c['exception.displayer.debug'] );
        };
    }
}