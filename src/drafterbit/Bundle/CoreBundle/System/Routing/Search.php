<?php

namespace drafterbit\Bundle\CoreBundle\System\Routing;

use drafterbit\System\Application;

class Search extends Application
{
    public function getRoutePrefix()
    {
        return 'search';
    }

    public function getRouteResources()
    {
        return ['xml' => ['@CoreBundle/Resources/config/routing/search.xml']];
    }

    public function getOptions()
    {
        return ['Search' => 'search'];
    }
}
