<?php

namespace Drafterbit\Bundle\SystemBundle\Routing\Loader;

use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\Config\Loader\LoaderResolverInterface;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

class FrontendLoader implements LoaderInterface
{
    private $loaded = false;
    private $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    /**
     * @todo clean this
     */
    public function load($resource, $type = null)
    {
        if (true === $this->loaded) {
            throw new \RuntimeException('Do not add this loader twice');
        }

        $routes = new RouteCollection();

        $frontPageConfig = $this->container->get('system')->get('system.frontpage', 'blog');

        $frontPageProvider = $this->container->get('dt_system.frontpage_provider');

        $reservedBaseUrl = [$this->container->getParameter('admin')];
        
        foreach ($frontPageProvider->all() as $prefix => $frontPage) {

            $frontRoutes = $frontPage->getRoutes();
            
            if($prefix !== $frontPageConfig) {
                $frontRoutes->addPrefix($frontPage->getRoutePrefix());
                $reservedBaseUrl[] = $prefix;
            }

            $routes->addCollection($frontRoutes);
        }

        $defaults = array('_controller' => 'PageBundle:Frontend:view');

        // check if configured frontpage is not an app
        if(!array_key_exists($frontPageConfig, $frontPageProvider->all()))
        {
            // its page
            $defaults['slug'] = $frontPageConfig;
            $routes->add('_home', new Route('/', $defaults));
        }

        $reservedBaseUrl = implode('|', $reservedBaseUrl);

        // @link http://stackoverflow.com/questions/25496704/regex-match-slug-except-particular-start-words
        // @prototype  'slug' => "^(?!(?:backend|blog)(?:/|$)).*$"
        $requirements = array(
            'slug' => "^(?!(?:%admin%|".$reservedBaseUrl."|)(?:/|$)).*$"
        );

        $route2 = new Route('/{slug}', $defaults, $requirements);
        $routes->add('misc', $route2);

        return $routes;
    }

    public function supports($resource, $type = null)
    {
        return 'frontend' === $type;
    }

    public function getResolver()
    {
    }

    public function setResolver(LoaderResolverInterface $resolver)
    {
        // irrelevant to us, since we don't need a resolver
    }
}