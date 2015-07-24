<?php

namespace Drafterbit\Bundle\BlogBundle\System\Frontpage;

use Drafterbit\Bundle\SystemBundle\System\Frontpage\Frontpage;
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
            new Route('/', ['_controller' => 'BlogBundle:Frontend:index'])
        );

        $routes->add('drafterbit_blog_post_front_view', new Route('/{year}/{month}/{date}/{slug}',
            ['_controller' => 'BlogBundle:Frontend:view'],
            [
            'year' => '\d{4}',
            'month' => '\d{2}',
            'date' => '\d{2}'
            ])
        );

        $routes->add('drafterbit_blog_category_front_view',
            new Route('/category/{slug}', ['_controller' => 'BlogBundle:Frontend:category'] )
            );

        $routes->add('drafterbit_blog_tag_front_view',
            new Route('/tag/{slug}', ['_controller' => 'BlogBundle:Frontend:tag'])
        );

        $routes->add('drafterbit_blog_author_front_view',
            new Route('/author/{username}', ['_controller' => 'BlogBundle:Frontend:author'])
        );

        $routes->add('drafterbit_blog_feed',
            new Route('/feed.xml', ['_controller' => 'BlogBundle:Post:feed'])
        );

        $routes->add('drafterbit_blog_comment_submit',
            new Route('/comment/submit', ['_controller' => 'BlogBundle:Frontend:commentSubmit'], ['methods' => 'post'])
        );

        return $routes;
    }

    public function getOptions()
    {
        return ['blog' => 'Blog'];
    }
}
