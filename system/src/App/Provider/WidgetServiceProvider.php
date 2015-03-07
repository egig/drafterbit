<?php namespace Drafterbit\App\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\App\Widget\WidgetManager;
use Drafterbit\App\Widget\WidgetUIBuilder;

class WidgetServiceProvider implements ServiceProviderInterface
{

    function register(Container $app)
    {
        $app['widget'] = function($c) {
            return new WidgetManager($c['loader']);
        };

        $app['widget.ui'] = function () {
            return new WidgetUIBuilder;
        };
    }
}
