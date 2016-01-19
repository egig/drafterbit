<?php

namespace Drafterbit\Bundle\PageBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Reference;

class AdminRoutePass implements CompilerPassInterface {
	
	public function process(ContainerBuilder $container)
    {
        $definition = $container->getDefinition('dt_system.frontpage.admin');
        $definition->addMethodCall('addRouteResources', ['@PageBundle/Controller/Admin']);
    }
}