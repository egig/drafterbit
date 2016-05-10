<?php

namespace drafterbit\Bundle\CoreBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\XmlFileLoader;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\Config\Definition\Processor;
use drafterbit\Bundle\CoreBundle\CoreBundle;

class CoreExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = $this->getConfiguration($configs, $container);
        $config = (new Processor())->processConfiguration($configuration, $configs);
        $container->setParameter(CoreBundle::NAVIGATION, $config['navigation']);

        $loader = new XmlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.xml');
        $loader->load('twig.xml');
        $loader->load('widget.xml');
        $loader->load('dashboard.xml');
        $loader->load('roles.xml');
        $loader->load('form.xml');
    }
}
