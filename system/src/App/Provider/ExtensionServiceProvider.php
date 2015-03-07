<?php namespace Drafterbit\App\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\App\ExtensionManager;

class ExtensionServiceProvider implements ServiceProviderInterface
{

    function register(Container $app)
    {
        $app['extension.manager'] = function($c) {
            return new ExtensionManager($c, $c['loader'], $c['path.extensions']);
        };
    }
}
