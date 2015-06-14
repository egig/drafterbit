<?php

namespace Drafterbit\Bundle\SystemBundle\Frontpage;

use Drafterbit\System\FrontPage\FrontPageInterface;
use Symfony\Component\Routing\Route;

class Search implements FrontPageInterface
{
    public function getName()
    {
        return 'search';
    }

    public function resolve($key){
        return new Route('/', ['_controller' => 'DrafterbitSystemBundle:Frontend:search']);
    }

    public function getType() {
        return 'standard';
    }

    public function getRoute()
    {
        return new Route('/search', ['_controller' => 'DrafterbitSystemBundle:Frontend:search']);
    }

    public function getLabel()
    {
        return 'Search';
    }
}