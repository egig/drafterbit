<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Drafterbit\Bundle\DistributionBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

/**
 * Compiler pass to add steps to the web configurator.
 *
 * @author Jérôme Vieilledent <lolautruche@gmail.com>
 */
class StepsPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('installer')) {
            return;
        }

        $configuratorDef = $container->findDefinition('installer');
        foreach ($container->findTaggedServiceIds('installer.step') as $id => $tags) {
            $configuratorDef->addMethodCall('addStep', array(new Reference($id)));
        }
    }
}
