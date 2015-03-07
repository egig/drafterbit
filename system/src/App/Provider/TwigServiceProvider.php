<?php namespace Drafterbit\App\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\App\Twig\SystemExtension;

class TwigServiceProvider implements ServiceProviderInterface
{

    public function register(Container $app)
    {
        $app['twig.options'] = [];
        $app['twig.templates'] = [];

        $options = [
            'autoescape'       => false,
            'charset'          => $app['config']['app.charset'],
            'debug'            => $app['config']['app.debug'],
            'strict_variables' => $app['config']['app.debug'],
        ];

        if(!$app['debug']) {
            $options['cache'] = $app['path.content'].'cache/view';
        }

        $app['twig'] = function ($app) use ($options) {

            // we will set loader later, on frontendController;
            $loader = null;
            $twig = new \Twig_Environment($loader, $options);
            $twig->addGlobal('app', $app);

            $twig->addExtension(new SystemExtension);

            if ($app['config']['app.debug']) {
                $twig->addExtension(new \Twig_Extension_Debug());
            }
            
            return $twig;
        };
    }
}
