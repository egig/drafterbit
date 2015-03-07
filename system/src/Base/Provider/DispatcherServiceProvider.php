<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Symfony\Component\EventDispatcher\EventDispatcher;

class DispatcherServiceProvider implements ServiceProviderInterface {
    
    public function register(Container $app)
    {
        $app['dispatcher'] = function(){
            return new EventDispatcher;
        };
    }
}