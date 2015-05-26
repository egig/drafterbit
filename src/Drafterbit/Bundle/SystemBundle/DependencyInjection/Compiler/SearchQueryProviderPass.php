<?php

namespace Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Reference;

class SearchQueryProviderPass implements CompilerPassInterface {

    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('drafterbit_system.search.engine')) {
            return;
        }

        $definition = $container->getDefinition(
            'drafterbit_system.search.engine'
        );

        $taggedServices = $container->findTaggedServiceIds(
            'drafterbit_system.search.query_provider'
        );

        foreach ($taggedServices as $id => $tags) {
            $definition->addMethodCall(
                'addQueryProvider',
                array(new Reference($id))
            );
        }
    }
}