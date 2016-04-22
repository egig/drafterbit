<?php

namespace Drafterbit\Bundle\BlogBundle\Routing\Loader;

use Symfony\Component\Config\Loader\Loader;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

class BlogLoader extends Loader
{
    private $loaded = false;
    private $system;

    public function __construct($system)
    {
        $this->system = $system;
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

        // post
        $path = $this->system->get('blog.post_path', '/{_locale}/{year}/{month}/{date}/{slug}');

        $defaults = ['_controller' => 'BlogBundle:Frontend:view'];
        $requirements = ['year' => '\d{4}', 'month' => '\d{2}', 'date' => '\d{2}'];
        $postRoute = new Route($path, $defaults, $requirements);

        $routes->add('dt_blog_post_front_view', $postRoute);

        $frontPageConfig = $this->system->get('system.frontpage', 'blog');
        if ('blog' !== $frontPageConfig) {
            $routes->addPrefix('blog');
        }

        return $routes;
    }

    public function supports($resource, $type = null)
    {
        return 'blog' === $type;
    }
}
