<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Translation\Translator;
use Symfony\Component\Translation\MessageSelector;
use Symfony\Component\Translation\Loader\ArrayLoader;
use Symfony\Component\Translation\Loader\JsonFileLoader;

class TranslationServiceProvider implements ServiceProviderInterface {

    public function register(Container $app)
    {
        $app['translator'] = function($app){
            $translator = new Translator('en_EN', new MessageSelector);

            $translator->addLoader('array', new ArrayLoader());
            $translator->addLoader('json', new JsonFileLoader());

            return $translator;
        };
    }
}