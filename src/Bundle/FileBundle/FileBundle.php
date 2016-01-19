<?php

namespace Drafterbit\Bundle\FileBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Drafterbit\Bundle\FileBundle\DependencyInjection\Compiler\AdminRoutePass;

class FileBundle extends Bundle
{
	public function build(ContainerBuilder $container) {

		parent::build($container);
        $container->addCompilerPass(new AdminRoutePass());
	}
}
