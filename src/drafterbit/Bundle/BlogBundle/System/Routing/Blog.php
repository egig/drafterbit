<?php

namespace drafterbit\Bundle\BlogBundle\System\Routing;

use drafterbit\System\Routing\ApplicationRouteInterface;

class Blog implements ApplicationRouteInterface
{
    public function getRoutePrefix()
    {
        return 'blog';
    }

    public function getRouteResources()
    {
        return ['xml' => ['@BlogBundle/Resources/config/routing/blog.xml']];
    }

    public function getOptions()
    {
        return ['Blog' => 'blog'];
    }
}
