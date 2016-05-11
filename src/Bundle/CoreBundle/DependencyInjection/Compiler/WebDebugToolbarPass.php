<?php

namespace drafterbit\Bundle\CoreBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use drafterbit\Bundle\CoreBundle\EventListener\WebDebugToolbarListener;

class WebDebugToolbarPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $definition = $container->getDefinition('web_profiler.debug_toolbar');
        $definition->setClass(WebDebugToolbarListener::class);
    }
}
