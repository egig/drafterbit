<?php

namespace Drafterbit\Bundle\SystemBundle\System\Routing;

use Drafterbit\System\Routing\ApplicationRouteInterface;

class Search implements ApplicationRouteInterface
{
    public function getRoutePrefix()
    {
        return 'search';
    }

    public function getRouteResources()
    {
        return '@SystemBundle/Controller/Site';
    }

    public function getOptions()
    {
        return ['Search' => 'search'];
    }
}
