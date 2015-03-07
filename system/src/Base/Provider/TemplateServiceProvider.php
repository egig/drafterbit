<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Template\TemplateManager;

class TemplateServiceProvider implements ServiceProviderInterface {

    public function register(Container $app)
    {
        $app['template'] = function($c) {
            $urlPrefix = base_url($c['dir.content'].'/cache/asset');
            $templateManager = new TemplateManager($c['path'].'views/', null, $c['asset'], $urlPrefix);

            return $templateManager;
        };
    }
}