<?php

namespace drafterbit\Bundle\SystemBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\LogDisplayFormatterPass;
use drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\ApplicationRoutePass;
use drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\DashboardPass;
use drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\WidgetPass;
use drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\SearchQueryProviderPass;
use drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\SettingFieldPass;
use drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\ExtensionsPass;
use drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\WebDebugToolbarPass;
use drafterbit\Bundle\SystemBundle\DependencyInjection\Compiler\AdminRoutePass;

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
        $container->addCompilerPass(new AdminRoutePass());

        if (php_sapi_name() !== 'cli' and ($container->getParameter('kernel.environment') === 'dev')) {
            $container->addCompilerPass(new WebDebugToolbarPass());
        }
    }
}
