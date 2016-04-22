<?php

namespace drafterbit\Bundle\DistributionBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use drafterbit\Bundle\DistributionBundle\DependencyInjection\Compiler\StepsPass;

class DistributionBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);
        $container->addCompilerPass(new StepsPass());
    }
}
