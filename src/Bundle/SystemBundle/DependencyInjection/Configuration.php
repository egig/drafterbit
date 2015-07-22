<?php

namespace Drafterbit\Bundle\SystemBundle\DependencyInjection;

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
                    ->useAttributeAsKey('name')
                    ->prototype('array')

                        ->children()
                            ->scalarNode('label')->end()
                               ->scalarNode('route')->defaultValue('')->end()
                               ->arrayNode('children')
                                ->prototype('array')
                                    ->children()
                                           ->scalarNode('label')->end()
                                           ->scalarNode('route')->defaultValue('')->end()
                                       ->end()
                                   ->end()
                               ->end()
                        ->end()

                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
    }
}
