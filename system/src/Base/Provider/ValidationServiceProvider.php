<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Validation\Validator;
use Drafterbit\Component\Validation\Form;

class ValidationServiceProvider implements ServiceProviderInterface {

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register(Container $app)
    {
        $app['validator'] = function() {
            return new Validator();
        };

        $app['validation.form'] = $app->factory(function($app) {
            return new Form($app['validator'], $app['translator']);
        });
    }
}