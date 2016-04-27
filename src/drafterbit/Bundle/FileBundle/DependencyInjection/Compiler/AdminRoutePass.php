<?php

namespace drafterbit\Bundle\FileBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;

class AdminRoutePass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $definition = $container->getDefinition('drafterbit.system.application.admin');
        $definition->addMethodCall('addRouteResources', ['@FileBundle/Resources/config/routing.xml', 'xml']);
    }
}
