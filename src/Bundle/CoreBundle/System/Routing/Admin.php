<?php

namespace drafterbit\Bundle\CoreBundle\System\Routing;

use drafterbit\Core\Application;

class Admin extends Application
{
    public function getRoutePrefix()
    {
        return 'admin';
    }
}
