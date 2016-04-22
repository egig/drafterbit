<?php

namespace drafterbit\System\Routing;

use Symfony\Component\Routing\Route;

interface ApplicationRouteInterface
{
    /**
     * Route prefix will be used if its not used as front page.
     *
     * @return string
     */
    public function getRoutePrefix();

    /**
     * Get app oute collection.
     *
     * @return RouteCollection
     */
    public function getRouteResources();

    /**
     * Get option for frontpage setting.
     *
     * @return array
     */
    public function getOptions();
}
