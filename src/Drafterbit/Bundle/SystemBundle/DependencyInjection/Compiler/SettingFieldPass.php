<?php

namespace Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Reference;

class SettingFieldPass implements CompilerPassInterface {

    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('drafterbit_system.setting.field_manager')) {
            return;
        }

        $definition = $container->getDefinition(
            'drafterbit_system.setting.field_manager'
        );

        $taggedServices = $container->findTaggedServiceIds(
            'drafterbit_system.setting.field'
        );

        foreach ($taggedServices as $id => $tags) {
            $definition->addMethodCall(
                'addField',
                array(new Reference($id))
            );
        }
    }
}