<?php

namespace Drafterbit\Bundle\PageBundle\System\Routing;

use Drafterbit\System\Routing\ApplicationRouteInterface;

class Admin implements ApplicationRouteInterface
{
    public function getRoutePrefix()
    {
        return 'admin';
    }

    public function getRouteResources()
    {
        return '@PageBundle/Controller/Admin';
    }

    public function getOptions()
    {
        return [];
    }
}