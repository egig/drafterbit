<?php

namespace Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Reference;

class DashboardPass implements CompilerPassInterface {

    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('drafterbit_system.dashboard_manager')) {
            return;
        }

        $definition = $container->getDefinition(
            'drafterbit_system.dashboard_manager'
        );

        $taggedServices = $container->findTaggedServiceIds(
            'drafterbit_system.dashboard.panel'
        );

        foreach ($taggedServices as $id => $tags) {
            $definition->addMethodCall(
                'addPanel',
                array(new Reference($id))
            );
        }
    }
}