<?php

namespace Drafterbit\System\Extension;

abstract class Shortcut
{
    public $container;

    public function setContainer($container)
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