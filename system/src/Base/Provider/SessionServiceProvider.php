<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Session\SessionManager;

class SessionServiceProvider implements ServiceProviderInterface {
    
    public function register(Container $app)
    {
        $app['session'] = function ($c) {
            $config = $c['config']['session'];
            return new SessionManager($c, $config);
        };
    }
}