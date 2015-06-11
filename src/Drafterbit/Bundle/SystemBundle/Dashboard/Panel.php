<?php

namespace Drafterbit\Bundle\SystemBundle\Dashboard;

use Symfony\Component\HttpKernel\Kernel;

abstract class Panel implements PanelInterface {

    protected $kernel;
    protected $position = 'left';

    public function __construct(Kernel $kernel)
    {
        $this->kernel = $kernel;
    }

    abstract public function getView();

    abstract public function getName();

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
        return $this->kernel->getContainer()->get('templating')->render($view, $parameters);
    }
}