<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Config\Config;

class ConfigServiceProvider implements ServiceProviderInterface {
    
    public function register(Container $app)
    {
        $app['config'] = function($c){
            $config = new Config($c['path.config'], $c['environment']);

            // asset
            $config->addReplaces('%path.vendor.asset%', $c['path'].'../../vendor/web');
            $config->addReplaces('%path.system.asset%', $c['path'].'Resources/public/assets');

            return $config;
        };
    }
}