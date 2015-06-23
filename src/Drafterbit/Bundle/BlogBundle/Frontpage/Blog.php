<?php

namespace Drafterbit\Bundle\BlogBundle\Frontpage;

use Drafterbit\Bundle\SystemBundle\Frontpage\Frontpage;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

class Blog extends Frontpage
{
    public function getRoutePrefix()
    {
        return 'blog';
    }

    public function getRoutes()
    {
        $routes = new RouteCollection;

        $routes->add('drafterbit_blog_category_front_home',
            new Route('/', ['_controller' => 'DrafterbitBlogBundle:Frontend:index'])
        );

        $routes->add('drafterbit_blog_post_front_view', new Route('/{year}/{month}/{date}/{slug}',
            ['_controller' => 'DrafterbitBlogBundle:Frontend:view'],
            [
            'year' => '\d{4}',
            'month' => '\d{2}',
            'date' => '\d{2}'
            ])
        );

        $routes->add('drafterbit_blog_category_front_view',
            new Route('/category/{slug}', ['_controller' => 'DrafterbitBlogBundle:Frontend:category'] )
            );

        $routes->add('drafterbit_blog_tag_front_view',
            new Route('/tag/{slug}', ['_controller' => 'DrafterbitBlogBundle:Frontend:tag'])
        );

        $routes->add('drafterbit_blog_author_front_view',
            new Route('/author/{username}', ['_controller' => 'DrafterbitBlogBundle:Frontend:author'])
        );

        $routes->add('drafterbit_blog_feed',
            new Route('/feed.xml', ['_controller' => 'DrafterbitBlogBundle:Post:feed'])
        );

        return $routes;
    }

    public function getOptions()
    {
        return ['blog' => 'Blog'];
    }
}