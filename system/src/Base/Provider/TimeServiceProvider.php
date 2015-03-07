<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Support\TimeHelper;

class TimeServiceProvider implements ServiceProviderInterface {

    function register(Container $app)
    {
        $app['time'] = function($c) {

            TimeHelper::setTranslator($c['translator']);
                        
            return  new TimeHelper;
        };
    }
}