<?php namespace Drafterbit\App\Provider;

use Pimple\Container;
use Drafterbit\App\ThemeManager;
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
