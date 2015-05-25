<?php

namespace Drafterbit\Bundle\BlogBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\XmlFileLoader;
use Symfony\Component\Config\FileLocator;
use Drafterbit\Bridge\DependencyInjection\Extension;

class DrafterbitBlogExtension extends Extension
{
    public function loadInternal(array $config, ContainerBuilder $container)
    {
    	$this->mergeNavigation($container, $config['navigation']);

        $loader = new XmlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.xml');
        $loader->load('roles.xml');
    }
}