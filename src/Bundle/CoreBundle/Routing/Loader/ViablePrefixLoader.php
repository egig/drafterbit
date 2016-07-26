<?php

namespace drafterbit\Bundle\CoreBundle\Routing\Loader;

use Symfony\Component\Config\Loader\Loader;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;
use drafterbit\Core\ApplicationManager;

class ViablePrefixLoader extends Loader
{
    private $loaded = false;
    private $applicationManager;
    private $systemModel;
    private $isMultilingual;
    private $locale;
    private $reservedBaseUrls;

    public function __construct(ApplicationManager $applicationManager, $systemModel, $reservedBaseUrls, $isMultilingual, $locale)
    {
        $this->applicationManager = $applicationManager;
        $this->systemModel        = $systemModel;
        $this->reservedBaseUrls   = $reservedBaseUrls;
        $this->isMultilingual     = $isMultilingual;
        $this->locale             = $locale;

        $this->frontPageConfig = $this->systemModel->get('system.frontpage', null);
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

        $this->loadAllRoutes($routes);
        $this->addDefaultRoutes($routes);

        return $routes;
    }

    /**
     * Add all routes;
     *
     * @return void
     * @author 
     **/
    private function loadAllRoutes(&$routes)
    {
        // @todo clean this
        foreach ($this->applicationManager->getRoutes() as $prefix => $frontPages) {
            foreach ($frontPages as $frontPage) {
                $resources = $frontPage->getRouteResources();

                if ($resources) {
                    foreach ($resources as $type => $resourcesx) {
                        foreach ($resourcesx as $resource) {

                            // Load route resources
                            $frontRoutes = $this->import($resource, $type);

                            if ($prefix !== $this->frontPageConfig) {
                                $frontRoutes->addPrefix($frontPage->getRoutePrefix());

                                if (!in_array($prefix, $this->reservedBaseUrls)) {
                                    $this->reservedBaseUrls[] = $prefix;
                                }
                            }

                            $routes->addCollection($frontRoutes);
                        }
                    }
                }
            }
        }
    }

    /**
     * Add default routes
     *
     * @return RouteCollection
     * @author 
     **/
    private function addDefaultRoutes(&$routes)
    {
        $reservedBaseUrl = implode('|', $this->reservedBaseUrls);

        // @link http://stackoverflow.com/questions/25496704/regex-match-slug-except-particular-start-words
        // @prototype  'slug' => "^(?!(?:backend|blog)(?:/|$)).*$"
        $requirements = array(
            'slug' => '^(?!(?:'.$reservedBaseUrl.'|)(?:/|$)).*$',
        );

        $defaults = array('_controller' => 'PageBundle:Frontend:view');
        $route2 = new Route('/{slug}', $defaults, $requirements);
        $routes->add('misc', $route2);

        // check if configured frontpage is not an app
        if (!$this->applicationManager->hasPrefix($this->frontPageConfig)) {
            $defaults['slug'] = $this->frontPageConfig;
            $routes->add('_home', new Route('/', $defaults));
        }

        if ($this->isMultilingual) {
            // last config: locale
            // @todo determine available locales, not just en|id
            $routes->addPrefix('{_locale}');

            /* @todo get installed language */
            $routes->addRequirements([
                '_locale' => 'en|id',
            ]);

            $routes->addDefaults([
                '_locale' => $this->locale,
            ]);
        }
    }

    public function supports($resource, $type = null)
    {
        return 'viable_prefix' === $type;
    }
}
