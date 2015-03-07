<?php namespace Drafterbit\Extensions\System\Providers;

use Pimple\Container;
use Gregwar\Image\Image;
use Pimple\ServiceProviderInterface;

class ImageServiceProvider implements ServiceProviderInterface
{

    function register(Container $app)
    {
        $app['image'] = $app->factory(
            function(){
                return (new Image)->setCacheDir($app['path.install'].'cache/images');
            }
        );
    }
}
