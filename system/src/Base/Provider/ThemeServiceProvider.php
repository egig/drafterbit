<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Drafterbit\Base\ThemeManager;
use Pimple\ServiceProviderInterface;

class ThemeServiceProvider implements ServiceProviderInterface
{

    function register(Container $app)
    {
        $app['themes'] = function($c) {
            return new ThemeManager([$c['path.content'].'themes']);
        };
    }
}
