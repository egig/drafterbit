<?php

namespace Drafterbit\Bundle\SystemBundle\System\Routing;

use Drafterbit\System\Routing\ApplicationRouteInterface;

class Admin implements ApplicationRouteInterface
{
    private $routeResources = ['@SystemBundle/Controller/Admin'];

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

    public function addRouteResources($resource) {
        array_push($this->routeResources, $resource);
    }
}
