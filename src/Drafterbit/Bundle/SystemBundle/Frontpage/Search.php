<?php

namespace Drafterbit\Bundle\SystemBundle\Frontpage;

use Drafterbit\Bundle\SystemBundle\FrontpageInterface;
use Symfony\Component\Routing\Route;

class Search implements FrontpageInterface
{
	public function getName()
	{
		return 'search';
	}

	public function resolve($key){
		return new Route('/', ['_controller' => 'DrafterbitSystemBundle:System:search']);
	}

	public function getType() {
		return 'standard';
	}

	public function getRoute()
	{
		return new Route('/search', ['_controller' => 'DrafterbitSystemBundle:System:search']);
	}

	public function getLabel()
	{
		return 'Search';
	}
}