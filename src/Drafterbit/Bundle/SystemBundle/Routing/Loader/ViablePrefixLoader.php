<?php

namespace Drafterbit\Bundle\SystemBundle\Routing\Loader;

use Symfony\Component\Config\Loader\Loader;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

class ViablePrefixLoader extends Loader
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

        $frontPageProvider = $this->container->get('dt_system.application_route_manager');

        $reservedBaseUrl = [$this->container->getParameter('admin')];

        // @todo clean this
        foreach ($frontPageProvider->all() as $prefix => $frontPages) {
            foreach ($frontPages as $frontPage) {
                $resources = $frontPage->getRouteResources();

                if ($resources) {
                    foreach ($resources as $type => $resourcesx) {
                        foreach ($resourcesx as $resource) {

                            // Load route resources
                            $frontRoutes = $this->import($resource, $type);

                            if ($prefix !== $frontPageConfig) {
                                $frontRoutes->addPrefix($frontPage->getRoutePrefix());

                                if (!in_array($prefix, $reservedBaseUrl)) {
                                    $reservedBaseUrl[] = $prefix;
                                }
                            }

                            $routes->addCollection($frontRoutes);
                        }
                    }
                }
            }
        }

        $reservedBaseUrl = implode('|', $reservedBaseUrl);

        // @link http://stackoverflow.com/questions/25496704/regex-match-slug-except-particular-start-words
        // @prototype  'slug' => "^(?!(?:backend|blog)(?:/|$)).*$"
        $requirements = array(
            'slug' => '^(?!(?:%admin%|'.$reservedBaseUrl.'|)(?:/|$)).*$',
        );

        $defaults = array('_controller' => 'PageBundle:Frontend:view');
        $route2 = new Route('/{slug}', $defaults, $requirements);
        $routes->add('misc', $route2);

        // check if configured frontpage is not an app
        if (!array_key_exists($frontPageConfig, $frontPageProvider->all())) {
            // its page
            $defaults['slug'] = $frontPageConfig;
            $routes->add('_home', new Route('/', $defaults));
        }

        if ($this->container->getParameter('multilingual')) {
            // last config: locale
            // @todo determine available locales, not just en|id
            $routes->addPrefix('{_locale}');

            /* @todo get installed language */
            $routes->addRequirements([
                '_locale' => 'en|id',
            ]);

            $routes->addDefaults([
                '_locale' => $this->container->getParameter('locale'),
            ]);
        }

        return $routes;
    }

    public function supports($resource, $type = null)
    {
        return 'viable_prefix' === $type;
    }
}
