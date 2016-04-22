<?php

namespace drafterbit\System\Setting;

use Symfony\Component\DependencyInjection\ContainerInterface;

abstract class Field implements FieldInterface
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }
}
