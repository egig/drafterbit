<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Cache\CacheManager;

class CacheServiceProvider implements ServiceProviderInterface {

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register(Container $app)
    {
        $app['cache'] = function($app) {
            $config = $app['config']['cache'];
            return new CacheManager($config);
        };
    }
}