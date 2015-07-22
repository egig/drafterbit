<?php

namespace Drafterbit\Bundle\SystemBundle\Frontpage;

use Drafterbit\System\FrontPage\FrontPageInterface;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

class Search implements FrontPageInterface
{
    public function getRoutePrefix()
    {
        return 'search';
    }

    public function getRoutes()
    {
        $routes = new RouteCollection;
        $routes->add('drafterbit_system_search', new Route('', ['_controller' => 'SystemBundle:Frontend:search']));
        return $routes;
    }

    public function getOptions()
    {
        return ['search' => 'Search'];
    }
}