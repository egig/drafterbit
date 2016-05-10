<?php

namespace drafterbit\Bundle\CoreBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Reference;

class SettingFieldPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('dt_system.setting.field_manager')) {
            return;
        }

        $definition = $container->getDefinition(
            'dt_system.setting.field_manager'
        );

        $taggedServices = $container->findTaggedServiceIds(
            'dt_system.setting.field'
        );

        foreach ($taggedServices as $id => $tags) {
            $definition->addMethodCall(
                'addField',
                array(new Reference($id))
            );
        }
    }
}
