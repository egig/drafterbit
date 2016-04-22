<?php

namespace drafterbit\Bundle\BlogBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use drafterbit\Bundle\BlogBundle\DependencyInjection\Compiler\AdminRoutePass;

class BlogBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);
        $container->addCompilerPass(new AdminRoutePass());
    }
}
