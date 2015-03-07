<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Cookie\CookieJar;

class CookieServiceProvider implements ServiceProviderInterface {
    
    public function register(Container $app)
    {
        $app['cookie'] = function () {
            return new CookieJar;
        };
    }
}