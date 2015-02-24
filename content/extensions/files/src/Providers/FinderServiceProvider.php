<?php namespace Drafterbit\Extensions\Files\Providers;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Symfony\Component\Finder\Finder;

class FinderServiceProvider implements ServiceProviderInterface
{

    function register(Container $app)
    {
        $app['finder'] = $app->factory(
            function($c) {
                return new Finder();
            }
        );
    }
}
