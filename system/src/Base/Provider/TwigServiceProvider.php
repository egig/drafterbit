<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Base\Twig\SystemExtension;

class TwigServiceProvider implements ServiceProviderInterface
{

    public function register(Container $app)
    {
        $app['twig.options'] = [];
        $app['twig.templates'] = [];

        $options = [
            'autoescape'       => false,
            'charset'          => 'UTF-8',
            'debug'            => $app['debug'],
            'strict_variables' => $app['debug'],
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

            if ($app['debug']) {
                $twig->addExtension(new \Twig_Extension_Debug());
            }
            
            return $twig;
        };
    }
}
