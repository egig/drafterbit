<?php

namespace Drafterbit\Bundle\DistributionBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Drafterbit\Bundle\DistributionBundle\DependencyInjection\Compiler\StepsPass;

class DistributionBundle extends Bundle
{
	public function build(ContainerBuilder $container)
	{
		parent::build($container);
		$container->addCompilerPass(new StepsPass());
	}
}