<?php

namespace drafterbit\Bundle\SystemBundle\System\Routing;

use drafterbit\System\Routing\ApplicationRouteInterface;

class Search implements ApplicationRouteInterface
{
    public function getRoutePrefix()
    {
        return 'search';
    }

    public function getRouteResources()
    {
        return ['xml' => ['@SystemBundle/Resources/config/routing/search.xml']];
    }

    public function getOptions()
    {
        return ['Search' => 'search'];
    }
}
