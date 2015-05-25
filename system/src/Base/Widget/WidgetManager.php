<?php namespace Drafterbit\Base\Widget;

class WidgetManager
{
    protected $widgets;

    /**
     * Register a widget;
     *
     * @param  Drafterbit\WidgetInterface $widget
     * @return void
     */
    public function register(WidgetInterface $widget)
    {
        $this->widgets[$widget->getName()] = $widget;
    }

    /**
     * Get a widget by name;
     *
     * @param  string $nameegis
     * @return Drafterbit\WidgetInterface
     */
    public function get($name)
    {
        return isset($this->widgets[$name]) ? $this->widgets[$name] : false;
    }

    /**
     * Get all registered widgets
     *
     * @return array
     */
    public function all()
    {
        return $this->widgets;
    }
}
