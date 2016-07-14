<?php

namespace drafterbit\Core;

class ApplicationManager
{
    /**
     * The Application Routes.
     *
     * @var array
     **/
    private $routes = [];

    /**
     * Register Application Routes.
     *
     * @param ApplicationRouteInterface $route
     */
    public function register(Application $app)
    {
        $prefix = $app->getRoutePrefix();

        if (!isset($this->routes[$prefix])) {
            $this->routes[$prefix] = array();
        }

        $this->routes[$prefix][] = $app;
    }

    /**
     * Get all application routes.
     *
     * @return array
     **/
    public function getRoutes()
    {
        return $this->routes;
    }

    /**
     * Check if the manger has a routes
     *
     * @param string $prefix
     * @return boolean
     * @author Egi Gundari <egigundari@gmail.com>
     **/
    public function hasPrefix($prefix)
    {
        return array_key_exists($prefix, $this->routes);
    }
}
