<?php

namespace drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Reference;

class ApplicationRoutePass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('dt_system.application_route_manager')) {
            return;
        }

        $definition = $container->getDefinition(
            'dt_system.application_route_manager'
        );

        $taggedServices = $container->findTaggedServiceIds(
            'dt_system.frontpage'
        );

        foreach ($taggedServices as $id => $tags) {
            $definition->addMethodCall(
                'register',
                array(new Reference($id))
            );
        }
    }
}
