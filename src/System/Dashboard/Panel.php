<?php

namespace Drafterbit\System\Dashboard;

use Symfony\Component\DependencyInjection\Container;

abstract class Panel implements PanelInterface {

    protected $container;
    protected $position = 'left';

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    abstract public function getView();

    abstract public function getName();

    public function getTitle()
    {
        return ucwords(str_replace('_', ' ', $this->getName()));
    }

    public function getPosition()
    {
        return $this->position;
    }

    public function setPosition($position)
    {
        $this->position = $position;
    }

    public function renderView($view, array $parameters = array())
    {
        return $this->container->get('templating')->render($view, $parameters);
    }

    public function getForm()
    {
        //..
    }
}