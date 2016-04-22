<?php

namespace drafterbit\Bundle\FileBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use drafterbit\Bundle\FileBundle\DependencyInjection\Compiler\AdminRoutePass;

class FileBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);
        $container->addCompilerPass(new AdminRoutePass());
    }
}
