<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Template\AssetManager;

class AssetServiceProvider implements ServiceProviderInterface {

    function register( Container $app)
    {
        $app['asset'] = function($c) use($app) {
            return new AssetManager(null, $c['debug']);
        };
    }
}