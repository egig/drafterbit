<?php

namespace Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Reference;

class FrontpageProviderPass implements CompilerPassInterface {

    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('drafterbit_system.frontpage_provider')) {
            return;
        }

        $definition = $container->getDefinition(
            'drafterbit_system.frontpage_provider'
        );

        $taggedServices = $container->findTaggedServiceIds(
            'drafterbit_system.frontpage'
        );

        foreach ($taggedServices as $id => $tags) {
            $definition->addMethodCall(
                'register',
                array(new Reference($id))
            );
        }
    }
}