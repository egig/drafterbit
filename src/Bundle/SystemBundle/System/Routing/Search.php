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
        return ['@SystemBundle/Resources/config/routing/search.xml'];
    }

    public function getRouteResourceType()
    {
        return 'xml';
    }

    public function getOptions()
    {
        return ['Search' => 'search'];
    }
}
