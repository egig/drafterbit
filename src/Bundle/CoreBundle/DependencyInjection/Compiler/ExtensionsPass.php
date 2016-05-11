<?php

namespace drafterbit\Bundle\CoreBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Reference;

class ExtensionsPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('extension_manager')) {
            return;
        }

        $definition = $container->getDefinition('extension_manager');

        $taggedServices = $container->findTaggedServiceIds('dt_system.extensions');

        foreach ($taggedServices as $id => $tags) {
            $definition->addMethodCall(
                'registerExtension',
                array(new Reference($id))
            );
        }
    }
}
