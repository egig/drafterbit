<?php

namespace drafterbit\Bundle\CoreBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    /**
     * Generates the configuration tree.
     *
     * @return TreeBuilder
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();

        $rootNode = $treeBuilder->root('core');

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
