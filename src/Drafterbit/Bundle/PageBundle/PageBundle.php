<?php

namespace Drafterbit\Bundle\PageBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Drafterbit\Bundle\PageBundle\DependencyInjection\Compiler\AdminRoutePass;

class PageBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);
        $container->addCompilerPass(new AdminRoutePass());
    }
}
