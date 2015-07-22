<?php

// @todo
// namespace Drafterbit\Tests;

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;

class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = array(
            new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
            new Symfony\Bundle\SecurityBundle\SecurityBundle(),
            new Symfony\Bundle\TwigBundle\TwigBundle(),
            new Symfony\Bundle\MonologBundle\MonologBundle(),
            new Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle(),
            new Symfony\Bundle\AsseticBundle\AsseticBundle(),
            new Doctrine\Bundle\DoctrineBundle\DoctrineBundle(),
            new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),

            new Sonata\IntlBundle\SonataIntlBundle(),
            new FOS\UserBundle\FOSUserBundle(),
            new Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle(),

        );

        if (in_array($this->getEnvironment(), array('dev', 'test', 'travis'))) {
            $bundles[] = new Symfony\Bundle\DebugBundle\DebugBundle();
            $bundles[] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
            $bundles[] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
            $bundles[] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle();
        }

        // we override some symfony class, so we place our bundles on the bottom
        $bundles[] = new Drafterbit\Bundle\BlogBundle\DrafterbitBlogBundle();
        $bundles[] = new Drafterbit\Bundle\PageBundle\PageBundle();
        $bundles[] = new Drafterbit\Bundle\FileBundle\DrafterbitFileBundle();
        $bundles[] = new Drafterbit\Bundle\UserBundle\DrafterbitUserBundle();
        $bundles[] = new Drafterbit\Bundle\SystemBundle\SystemBundle();
        $bundles[] = new Drafterbit\Bundle\InstallBundle\DrafterbitInstallBundle();

        return $bundles;
    }

    public function registerContainerConfiguration(LoaderInterface $loader)
    {
        $loader->load($this->getRootDir().'/config/config_'.$this->getEnvironment().'.yml');
    }
}