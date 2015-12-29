<?php

namespace Drafterbit\Bundle\SystemBundle\System\Routing;

use Drafterbit\System\Routing\ApplicationRouteInterface;

class Admin implements ApplicationRouteInterface
{
    public function getRoutePrefix()
    {
        return 'admin';
    }

    public function getRouteResources()
    {
        return '@SystemBundle/Controller/Admin';
    }

    public function getOptions()
    {
        return ['admin' => 'Admin'];
    }
}