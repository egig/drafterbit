<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Base\Widget\WidgetManager;
use Drafterbit\Base\Widget\WidgetUIBuilder;

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
