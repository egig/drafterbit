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

        $frontp = $this->container->get('system')->get('frontpage');

        $frontpageProvider = $this->container->get('drafterbit_system.frontpage_provider');

        $reservedBaseUrl = [$this->container->getParameter('admin')];
        
        foreach ($frontpageProvider->all() as $name => $frontpage) {
            $reservedBaseUrl[] = $name;

            if(method_exists($frontpage, 'getRouteCollection')) {
                $routes->addCollection($frontpage->getRouteCollection());
            }
            
            if($name !== $frontp) {
                $route = $frontpage->getRoute();
                $routes->add($name, $route);
            }
        }

        $route = $frontpageProvider->resolve($frontp);

        $routes->add('home', $route);

        // page or others
        $defaults2 = array(
            '_controller' => 'DrafterbitPageBundle:Frontend:view',
        );

        $reservedBaseUrl = implode('|', $reservedBaseUrl);

        $requirements = array(
            // @prototype  'slug' => "^(?!(?:backend|blog)(?:/|$)).*$"
            'slug' => "^(?!(?:%admin%|".$reservedBaseUrl."|)(?:/|$)).*$"
        );

        $route2 = new Route('/{slug}', $defaults2, $requirements);
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