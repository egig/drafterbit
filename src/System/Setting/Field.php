<?php

namespace Drafterbit\System\Setting;

use Symfony\Component\DependencyInjection\ContainerInterface;

abstract class Field implements FieldInterface
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function getName()
    {
        return $this->getFormType()->getName();
    }
}