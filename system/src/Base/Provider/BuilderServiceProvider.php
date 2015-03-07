<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Support\Builder;

class BuilderServiceProvider implements ServiceProviderInterface {
    
    public function register(Container $app)
    {
         $app['builder'] = function(){
            return new Builder;
        };
    }
}