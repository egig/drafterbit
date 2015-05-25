<?php

namespace Drafterbit\Bundle\BlogBundle\Frontpage;

use Drafterbit\Bundle\SystemBundle\Frontpage\Frontpage;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

class Blog extends Frontpage
{
	public function getName()
	{
		return 'blog';
	}

	public function resolve($key){

		return new Route('/', ['_controller' => 'DrafterbitBlogBundle:Frontend:index']);
	}

	public function getType() {
		return 'standard';
	}

	public function getRoute()
	{
		return new Route('/blog', ['_controller' => 'DrafterbitBlogBundle:Frontend:index']);
	}

	public function getRouteCollection()
	{
		$routes = new RouteCollection;
		if('blog' != $this->container->get('system')->get('frontpage')) {
			$routes->addPrefix('blog');
		}

		$routes->add('drrab_blog_post_front_view', new Route('/{year}/{month}/{date}/{slug}',
			['_controller' => 'DrafterbitBlogBundle:Frontend:view'],
			[
			'year' => '\d{4}',
	        'month' => '\d{2}',
	        'date' => '\d{2}'
			])
		);

		$routes->add('drafterbit_blog_category_front_view',
			new Route('category/{slug}', ['_controller' => 'DrafterbitBlogBundle:Frontend:category'] )
			);

		$routes->add('drafterbit_blog_tag_front_view',
			new Route('tag/{slug}', ['_controller' => 'DrafterbitBlogBundle:Frontend:tag'])
		);

		$routes->add('drafterbit_blog_author_front_view',
			new Route('author/{username}', ['_controller' => 'DrafterbitBlogBundle:Frontend:author'])
		);

		return $routes;
	}

	public function getLabel()
	{
		return 'Blog';
	}
}