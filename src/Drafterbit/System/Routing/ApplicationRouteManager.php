<?php

namespace Drafterbit\System\Routing;

class ApplicationRouteManager
{
    /**
     * The Application Routes.
     *
     * @var array
     **/
    protected $applicationRoutes = [];

    /**
     * Register Application Routes.
     *
     * @param ApplicationRouteInterface $route
     */
    public function register(ApplicationRouteInterface $route)
    {
        $prefix = $route->getRoutePrefix();

        if (!isset($this->applicationRoutes[$prefix])) {
            $this->applicationRoutes[$prefix] = array();
        }

        $this->applicationRoutes[$prefix][] = $route;
    }

    /**
     * Get all application routes.
     *
     * @return array
     **/
    public function all()
    {
        return $this->applicationRoutes;
    }
}
