<?php namespace Drafterbit\Component\Routing;

use Symfony\Component\Routing\RouteCollection as BaseCollection;

class RouteCollection extends BaseCollection {
  
    /**
     * {@inheritdoc}
     * @api
     */
    public function addPrefix($prefix, array $defaults = [], array $requirements = [])
    {
        $prefix = trim(trim($prefix), '/');

        if ('' === $prefix) {
            return;
        }

        foreach ($this->all() as $route) {

            $routePath = $route->getPath();
            $path = '/'.$prefix.($routePath != '/' ? $routePath : '');

            $route->setPath($path);
            
            $route->addDefaults($defaults);
            $route->addRequirements($requirements);
        }
    }

    /**
     * Ensure HTTP methods (e.g. 'POST') if no  route level  defined
     *
     * @return void
     */
    public function ensureMethods($methods)
    {
        foreach ($this->all() as $route) {
            if(!$route->getMethods()) {
                $route->setMethods($methods);
            }
        }
    }
}