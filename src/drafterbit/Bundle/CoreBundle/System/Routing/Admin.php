<?php

namespace drafterbit\Bundle\CoreBundle\System\Routing;

use drafterbit\System\Application;

class Admin extends Application
{
    public function getRoutePrefix()
    {
        return 'admin';
    }
}
