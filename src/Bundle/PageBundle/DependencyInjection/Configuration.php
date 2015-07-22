<?php

namespace Drafterbit\Bundle\PageBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Drafterbit\Bridge\DependencyInjection\ExtensionConfiguration;

class Configuration extends ExtensionConfiguration
{
    /**
     * Generates the configuration tree.
     *
     * @return TreeBuilder
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();

        $rootNode = $this->createRootNode($treeBuilder);

        $rootNode
            ->children()
                ->arrayNode('navigation')
                    ->addDefaultsIfNotSet()
                    ->children()
                        ->arrayNode('page')
                            ->addDefaultsIfNotSet()
                            ->children()
                                ->scalarNode('label')->defaultValue('Page')->end()
                                   ->scalarNode('route')->defaultValue('drafterbit_page')->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
     }
 }