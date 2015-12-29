<?php

namespace Drafterbit\Bundle\SystemBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;

use Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\LogDisplayFormatterPass;
use Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\ApplicationRoutePass;
use Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\FrontendTemplatingPass;
use Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\DashboardPass;
use Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\WidgetPass;
use Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\SearchQueryProviderPass;
use Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\SettingFieldPass;
use Drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\ExtensionsPass;

class SystemBundle extends Bundle
{
    const NAVIGATION = 'system.navigation';

    public function build(ContainerBuilder $container)
    {
        parent::build($container);
        $container->addCompilerPass(new LogDisplayFormatterPass());
        $container->addCompilerPass(new ApplicationRoutePass());
        $container->addCompilerPass(new DashboardPass());
        $container->addCompilerPass(new WidgetPass());
        $container->addCompilerPass(new SearchQueryProviderPass());
        $container->addCompilerPass(new SettingFieldPass());
        $container->addCompilerPass(new ExtensionsPass());
    }
}