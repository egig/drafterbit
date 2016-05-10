<?php

namespace drafterbit\Bundle\CoreBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Reference;

class DashboardPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('dt_system.dashboard_manager')) {
            return;
        }

        $definition = $container->getDefinition(
            'dt_system.dashboard_manager'
        );

        $taggedServices = $container->findTaggedServiceIds(
            'dt_system.dashboard.panel'
        );

        foreach ($taggedServices as $id => $tags) {
            $definition->addMethodCall(
                'addPanelType',
                array(new Reference($id))
            );
        }
    }
}
