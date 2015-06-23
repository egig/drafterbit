<?php

namespace Drafterbit\Bundle\SystemBundle\Frontpage;

use Drafterbit\System\FrontPage\FrontPageInterface;
use Symfony\Component\DependencyInjection\Container;

abstract class Frontpage implements FrontPageInterface
{
    protected $container;

    public function __construct( Container $container)
    {
        $this->container = $container;
    }

    abstract public function getRoutePrefix();

    abstract public function getRoutes();

    abstract public function getOptions();
}