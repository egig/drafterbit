<?php

namespace Drafterbit\Bundle\FileBundle\DependencyInjection;

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

                        ->arrayNode('file')
                            ->addDefaultsIfNotSet()
                            ->children()
                                ->scalarNode('label')->defaultValue('File')->end()
                                ->scalarNode('route')->defaultValue('drafterbit_file')->end()
                            ->end()
                        ->end()
                    
                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
     }
 }