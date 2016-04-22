<?php

namespace Drafterbit\Bundle\SystemBundle\System\Routing;

use Drafterbit\System\Routing\ApplicationRouteInterface;

class Admin implements ApplicationRouteInterface
{
    private $routeResources = [];

    public function getRoutePrefix()
    {
        return 'admin';
    }

    public function getRouteResources()
    {
        return $this->routeResources;
    }

    public function getOptions()
    {
        //..
    }

    public function getRouteResourceType()
    {
        return 'xml';
    }

    public function addRouteResources($resource, $type = 'annotation')
    {
        if (!isset($this->routeResources[$type])) {
            $this->routeResources[$type] = [];
        }

        array_push($this->routeResources[$type], $resource);
    }
}
