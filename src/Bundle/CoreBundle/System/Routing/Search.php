<?php

namespace drafterbit\Bundle\CoreBundle\System\Routing;

use drafterbit\System\Application;
use drafterbit\System\FrontPageApplicationInterface;

class Search extends Application implements FrontPageApplicationInterface
{
    public function getRoutePrefix()
    {
        return 'search';
    }

    public function getRouteResources()
    {
        return ['xml' => ['@CoreBundle/Resources/config/routing/search.xml']];
    }

    public function  getName() {
        return "Search";
    }

    public function getBasePath() {
        return $this->getRoutePrefix();
    }
}
