<?php

namespace Drafterbit\Bundle\SystemBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;

use Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\LogDisplayFormatterPass;
use Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\FrontpageProviderPass;
use Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\FrontendTemplatingPass;
use Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\DashboardPass;
use Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\WidgetPass;
use Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\SearchQueryProviderPass;

class DrafterbitSystemBundle extends Bundle
{
    const NAVIGATION = 'drafterbit_system.navigation';

    public function build(ContainerBuilder $container)
    {
        parent::build($container);
        $container->addCompilerPass(new LogDisplayFormatterPass());
        $container->addCompilerPass(new FrontpageProviderPass());
        $container->addCompilerPass(new DashboardPass());
        $container->addCompilerPass(new WidgetPass());
        $container->addCompilerPass(new SearchQueryProviderPass());
    }
}