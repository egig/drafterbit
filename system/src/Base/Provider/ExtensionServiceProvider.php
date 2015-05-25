<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Base\ExtensionManager;

class ExtensionServiceProvider implements ServiceProviderInterface
{

    function register(Container $app)
    {
        $app['extension'] = function($c) {
            return new ExtensionManager($c['loader']);
        };
    }
}
