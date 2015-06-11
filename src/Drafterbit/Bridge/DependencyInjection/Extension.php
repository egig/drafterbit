<?php

namespace Drafterbit\Bridge\DependencyInjection;

use Symfony\Component\DependencyInjection\Extension\Extension as BaseExtension;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\Definition\Processor;
use Drafterbit\Bundle\SystemBundle\DrafterbitSystemBundle;

abstract class Extension extends BaseExtension {

    /**
     * Load configuration
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = $this->getConfiguration($configs, $container);
        $config = (new Processor)->processConfiguration($configuration, $configs);
        $this->loadInternal($config, $container);
    }

    abstract function loadInternal(array $config, ContainerBuilder $container);

    /**
     * Merge navigation config
     *
     * @return null
     */
    protected function mergeNavigation(ContainerBuilder $container, $config)
    {
        if($container->hasParameter(DrafterbitSystemBundle::NAVIGATION)) {
            $currentConfig = $container->getParameter(DrafterbitSystemBundle::NAVIGATION);
        } else {
            $currentConfig = [];
        }

        $container->setParameter(DrafterbitSystemBundle::NAVIGATION, array_merge($currentConfig, $config));
    }

    /**
     * Get configuration class and set the extension
     *
     * @return Configuration
     */
    public function getConfiguration(array $config, ContainerBuilder $container)
    {
        $configuration = parent::getConfiguration($config, $container);
        $configuration->setExtension($this);
        return $configuration;
    }
}