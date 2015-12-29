<?php

namespace Drafterbit\Bundle\FileBundle\System\Routing;

use Drafterbit\System\Routing\ApplicationRouteInterface;

class Admin implements ApplicationRouteInterface
{
    public function getRoutePrefix()
    {
        return 'admin';
    }

    public function getRouteResources()
    {
        return '@FileBundle/Controller/Admin';
    }

    public function getOptions()
    {
        return [];
    }
}