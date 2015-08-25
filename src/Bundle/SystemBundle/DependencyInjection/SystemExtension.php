<?php

namespace Drafterbit\Bundle\SystemBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\XmlFileLoader;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\Config\Definition\Processor;
use Drafterbit\Bundle\SystemBundle\SystemBundle;

class SystemExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = $this->getConfiguration($configs, $container);
        $config = (new Processor)->processConfiguration($configuration, $configs);
        $container->setParameter(SystemBundle::NAVIGATION, $config['navigation']);

        $loader = new XmlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.xml');
        $loader->load('roles.xml');

    }
}