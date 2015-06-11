<?php

namespace Drafterbit\Bundle\SystemBundle\Frontpage;

use Drafterbit\Bundle\SystemBundle\FrontpageInterface;
use Symfony\Component\DependencyInjection\Container;

abstract class Frontpage implements FrontpageInterface
{
    protected $container;

    public function __construct( Container $container)
    {
        $this->container = $container;
    }

    abstract public function getName();

    abstract public function resolve($key);

    abstract public function getType();

    abstract public function getRoute();

    abstract public function getLabel();
}