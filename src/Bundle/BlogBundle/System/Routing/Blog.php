<?php

namespace Drafterbit\Bundle\BlogBundle\System\Routing;

use Drafterbit\System\Routing\ApplicationRouteInterface;

class Blog implements ApplicationRouteInterface
{
    public function getRoutePrefix()
    {
        return 'blog';
    }

    public function getRouteResources()
    {
        return '@BlogBundle/Controller/Site';
    }

    public function getOptions()
    {
        return ['Blog' => 'blog'];
    }
}
