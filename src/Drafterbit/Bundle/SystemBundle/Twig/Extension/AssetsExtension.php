<?php

namespace Drafterbit\Bundle\SystemBundle\Twig\Extension;

use Symfony\Component\Routing\RequestContext;
use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Bundle\TwigBundle\Extension\AssetsExtension as BaseExtension;

class AssetsExtension extends BaseExtension
{
    private $container;
    private $context;

    public function __construct(ContainerInterface $container, RequestContext $requestContext = null)
    {
        parent::__construct($container, $requestContext);
        $this->container = $container;
        $this->context = $requestContext;
    }

    public function getAssetUrl($path, $packageName = null, $absolute = false, $version = null)
    {
        if($path[0] == '@') {
            // exptected
            $segments = explode('/', $path);
            $bundle = ltrim(array_shift($segments), '@');
            $assetPath = implode('/', $segments);

            $bundle = $this->container->get('kernel')->getBundle($bundle);

            $bundleAssetPath = $this->getBundleAssetPath($bundle);

            $path = $bundleAssetPath.'/'.$assetPath;
        }

        return parent::getAssetUrl($path, $packageName, $absolute, $version);
    }

    /**
     * Get bundle asset path relativeo to web dirtectory
     *
     * @param  Symfony\Component\HttpKernel\Bundle\Bundle $bundle
     * @return string
     */
    private function getBundleAssetPath(Bundle $bundle)
    {
        return 'bundles/'.preg_replace('/bundle$/', '', strtolower($bundle->getName()));
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'assets';
    }
}
