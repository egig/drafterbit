<?php

namespace drafterbit\Core\Widget;

class WidgetManager
{
    /**
     * Registered widgets.
     *
     * @var array
     */
    protected $widgets = [];

    /**
     * Register a widget;.
     *
     * @param drafterbit\WidgetInterface $widget
     */
    public function register(WidgetInterface $widget)
    {
        $this->widgets[$widget->getName()] = $widget;
    }

    /**
     * Get a widget by name;.
     *
     * @param string $nameegis
     *
     * @return drafterbit\WidgetInterface
     */
    public function get($name)
    {
        return isset($this->widgets[$name]) ? $this->widgets[$name] : false;
    }

    /**
     * Get all registered widgets.
     *
     * @return array
     */
    public function all()
    {
        return $this->widgets;
    }
}
