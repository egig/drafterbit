<?php

namespace drafterbit\Core\Dashboard;

use Symfony\Component\DependencyInjection\Container;

abstract class PanelType implements PanelTypeInterface
{
    protected $container;
    protected $position = 'left';

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    abstract public function getView();

    abstract public function getName();

    public function renderView($view, array $parameters = array())
    {
        return $this->container->get('templating')->render($view, $parameters);
    }

    public function getFormType()
    {
        //..
    }

    public function getFormTemplate()
    {
        //..
    }
}
