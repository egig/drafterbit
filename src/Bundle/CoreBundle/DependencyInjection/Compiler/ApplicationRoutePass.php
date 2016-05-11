<?php

namespace drafterbit\Bundle\CoreBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Reference;

class ApplicationRoutePass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('drafterbit.system.application_manager')) {
            return;
        }

        $definition = $container->getDefinition(
            'drafterbit.system.application_manager'
        );

        $taggedServices = $container->findTaggedServiceIds(
            'drafterbit.system.application'
        );

        foreach ($taggedServices as $id => $tags) {
            $definition->addMethodCall(
                'register',
                array(new Reference($id))
            );
        }
    }
}
