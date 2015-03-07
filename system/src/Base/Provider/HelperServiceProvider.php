<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Helper\HelperManager;

class HelperServiceProvider implements ServiceProviderInterface {
    
    public function register(Container $app)
    {
        $app['helper'] = function(){
            return new HelperManager;
        };
    }
}