<?php

namespace Drafterbit\Bundle\BlogBundle\DependencyInjection;

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

                        ->arrayNode('blog')
                            ->addDefaultsIfNotSet()
                            ->children()
                                ->scalarNode('label')->defaultValue('Blog')->end()
                                ->arrayNode('children')
                                    ->addDefaultsIfNotSet()
                                    ->children()
                                        ->arrayNode('post')
                                            ->addDefaultsIfNotSet()
                                            ->children()
                                                    ->scalarNode('label')->defaultValue('Post')->cannotBeEmpty()->end()
                                                    ->scalarNode('route')->defaultValue('drafterbit_blog_post')->end()
                                            ->end()
                                        ->end()
                                        ->arrayNode('category')
                                            ->addDefaultsIfNotSet()
                                            ->children()
                                                    ->scalarNode('label')->defaultValue('Category')->cannotBeEmpty()->end()
                                                    ->scalarNode('route')->defaultValue('drafterbit_blog_category')->end()
                                            ->end()
                                        ->end()
                                        ->arrayNode('comment')
                                            ->addDefaultsIfNotSet()
                                            ->children()
                                                    ->scalarNode('label')->defaultValue('Comment')->cannotBeEmpty()->end()
                                                    ->scalarNode('route')->defaultValue('drafterbit_blog_comment')->end()
                                            ->end()
                                        ->end()
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