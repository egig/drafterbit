<?php namespace Drafterbit\System\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\System\ExtensionManager;

class ExtensionServiceProvider implements ServiceProviderInterface
{

    function register(Container $app)
    {
        $app['extension.manager'] = function($c) {

            $modulesPath = [
                $c['path.extensions'],
            ];
            return new ExtensionManager($c, $c['loader'], $modulesPath);
        };
    }
}
