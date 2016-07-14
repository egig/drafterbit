<?php

namespace drafterbit\Core;

abstract class Application
{
    protected $routeResources = [];

    /**
     * Route prefix will be used if its not used as front page.
     *
     * @return string
     */
    abstract public function getRoutePrefix();

    /**
     * Get app oute collection.
     *
     * @return RouteCollection
     */
    public function getRouteResources()
    {
        return $this->routeResources;
    }

    public function addRouteResources($resource, $type = 'annotation')
    {
        if (!isset($this->routeResources[$type])) {
            $this->routeResources[$type] = [];
        }

        array_push($this->routeResources[$type], $resource);
    }
}
