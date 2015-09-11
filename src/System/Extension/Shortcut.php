<?php

namespace Drafterbit\System\Extension;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;

abstract class Shortcut implements ContainerAwareInterface
{

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function getUrl(){

    }

    public function getText(){

    }

    public function getIconClass()
    {

    }
}