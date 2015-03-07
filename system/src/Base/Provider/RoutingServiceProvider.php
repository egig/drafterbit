<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Routing\Router;

class RoutingServiceProvider implements ServiceProviderInterface {
    
    public function register(Container $app)
    {
        $app['router'] = function($app){
            $cache = $app['debug'] ? null : $app['path.content'].'cache';
            return new Router($cache);
        };
    }
}