<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Http\Input;
use Symfony\Component\HttpFoundation\Request;

class InputServiceProvider implements ServiceProviderInterface {
    
    public function register(Container $app)
    {
        $app['input'] = function($c) {
            return new Input(Request::createFromGlobals());
        };
    }
}