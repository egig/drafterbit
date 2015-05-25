<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Template\AssetManager;

class AssetServiceProvider implements ServiceProviderInterface {

    function register( Container $app)
    {
        $app['asset'] = function($c) use($app) {
            $asset = new AssetManager(null, $c['debug']);

            foreach ($c['config']->get('asset.assets') as $name => $value) {
                $asset->register($name, $value);
            }

            foreach ([
                'chosen_css' => 'Drafterbit\\Base\\Asset\Filter\\ChosenFilter',
                'bootstrap_css' => 'Drafterbit\\Base\\Asset\Filter\\BootstrapFilter',
                'fontawesome' => 'Drafterbit\\Base\\Asset\Filter\\FontAwesomeFilter',
                'colorpicker_css' => 'Drafterbit\\Base\\Asset\Filter\\ColorPickerFilter'
            ]
            as $name => $class) {
                $asset->getFilterManager()->set($name, new $class($c['dir.system'].'/vendor/web'));
            }

            return $asset;
        };
    }
}