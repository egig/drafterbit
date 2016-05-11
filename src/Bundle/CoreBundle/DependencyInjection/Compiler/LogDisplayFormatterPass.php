<?php

namespace drafterbit\Bundle\CoreBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Reference;

class LogDisplayFormatterPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('dt_system.log.display_formatter')) {
            return;
        }

        $definition = $container->getDefinition(
            'dt_system.log.display_formatter'
        );

        $taggedServices = $container->findTaggedServiceIds(
            'dt_system_log.display_formatter'
        );

        foreach ($taggedServices as $id => $tags) {
            $definition->addMethodCall(
                'addEntityFormatter',
                array(new Reference($id))
            );
        }
    }
}
