<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Config\Config;

class ConfigServiceProvider implements ServiceProviderInterface {
    
    public function register(Container $app)
    {
        $app['config'] = function($c){
            return new Config($c['path.config'], $c['environment']);
        };
    }
}