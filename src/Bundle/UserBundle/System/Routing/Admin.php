<?php

namespace Drafterbit\Bundle\UserBundle\System\Routing;

use Drafterbit\System\Routing\ApplicationRouteInterface;

class Admin implements ApplicationRouteInterface
{
    public function getRoutePrefix()
    {
        return 'admin';
    }

    public function getRouteResources()
    {
        return '@UserBundle/Controller/Admin';
    }

    public function getOptions()
    {
        return [];
    }
}