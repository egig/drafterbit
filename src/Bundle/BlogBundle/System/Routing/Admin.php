<?php

namespace Drafterbit\Bundle\BlogBundle\System\Routing;

use Drafterbit\System\Routing\ApplicationRouteInterface;

class Admin implements ApplicationRouteInterface
{
    public function getRoutePrefix()
    {
        return 'admin';
    }

    public function getRouteResources()
    {
        return '@BlogBundle/Controller/Admin';
    }

    public function getOptions()
    {
        return [];
    }
}