<?php

namespace drafterbit\Bundle\SystemBundle\System\Routing;

use drafterbit\System\Application;

class Admin extends Application
{
    public function getRoutePrefix()
    {
        return 'admin';
    }
}
