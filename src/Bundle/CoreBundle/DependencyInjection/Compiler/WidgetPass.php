<?php

namespace drafterbit\Bundle\CoreBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Reference;

class WidgetPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('dt_system.widget.manager')) {
            return;
        }

        $definition = $container->getDefinition(
            'dt_system.widget.manager'
        );

        $taggedServices = $container->findTaggedServiceIds(
            'dt_system.widget'
        );

        foreach ($taggedServices as $id => $tags) {
            $definition->addMethodCall(
                'register',
                array(new Reference($id))
            );
        }
    }
}
