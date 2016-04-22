<?php

namespace drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;

class AdminRoutePass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $definition = $container->getDefinition('dt_system.frontpage.admin');
        $definition->addMethodCall('addRouteResources', ['@SystemBundle/Resources/config/routing/admin.xml', 'xml']);
    }
}
