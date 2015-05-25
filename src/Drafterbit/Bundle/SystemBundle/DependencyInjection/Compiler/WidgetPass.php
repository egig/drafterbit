<?php

namespace Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Reference;

class WidgetPass implements CompilerPassInterface {

    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('drafterbit_system.widget.manager')) {
            return;
        }

        $definition = $container->getDefinition(
            'drafterbit_system.widget.manager'
        );

        $taggedServices = $container->findTaggedServiceIds(
            'drafterbit_system.widget'
        );

        foreach ($taggedServices as $id => $tags) {
            $definition->addMethodCall(
                'register',
                array(new Reference($id))
            );
        }
    }
}