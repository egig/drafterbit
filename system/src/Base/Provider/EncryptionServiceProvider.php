<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Encryption\Encrypter;

class EncryptionServiceProvider implements ServiceProviderInterface {
    
    public function register(Container $app)
    {
        $app['encrypter'] = function ($c){
            return new Encrypter($c['config']['key']);
        };
    }
}