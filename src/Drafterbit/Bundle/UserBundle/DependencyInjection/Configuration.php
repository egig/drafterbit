<?php

namespace Drafterbit\Bundle\UserBundle\DependencyInjection;

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
                		->arrayNode('user')
		                    ->addDefaultsIfNotSet()
                			->children()
	                			->scalarNode('label')->defaultValue('User')->end()
	                			->arrayNode('children')
				                    ->addDefaultsIfNotSet()
	                				->children()
			                			->arrayNode('user')
						                    ->addDefaultsIfNotSet()
			                				->children()
	                								->scalarNode('label')->defaultValue('User')->cannotBeEmpty()->end()
	                								->scalarNode('route')->defaultValue('drafterbit_user')->end()
				                			->end()
			                			->end()
				                		->arrayNode('group')
						                    ->addDefaultsIfNotSet()
			                				->children()
	                								->scalarNode('label')->defaultValue('Group')->cannotBeEmpty()->end()
	                								->scalarNode('route')->defaultValue('drafterbit_user_group')->end()
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