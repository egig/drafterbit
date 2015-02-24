<?php namespace Drafterbit\System\Widget;

use Drafterbit\Framework\Controller;

abstract class Widget extends Controller implements WidgetInterface
{
    /**
     * Namespace origin is helper for namespaceparser
     *
     * @var string
     */
    protected $namespaceOrigin = 'Widgets';

    /**
     * Widget UI Builder.
     *
     * @var WidgetUIBuilder
     */
    protected $uiBuilder;

    /**
     * Widget data.
     *
     * @var array
     */
    protected $context = [];
    
    /**
     * Run the widget.
     *
     * @return string
     */
    abstract function run($context = null);

    /**
     * Get Namespace.
     *
     * @return string $key
     */
    public function getNamespace()
    {
        return (new \ReflectionObject($this))->getNamespaceName();
    }

    /**
     * Widget construction.
     *
     * @param WidgetUIBuilder $uiBuilder widget for build ui
     */
    public function __construct(WidgetUIBuilder $uiBuilder = null)
    {
        $this->uiBuilder = is_null($uiBuilder) ? new WidgetUIBuilder : $uiBuilder;
    }

    /**
     * Get contecxt type, mostly declared on each widget
     *
     * @return array
     */
    public function getContextTypes()
    {
        return [];
    }

    /**
     * Set widget data.
     *
     * @param array $data
     * @return void
     */
    public function setContext($context)
    {
        $this->context = $context;
    }

    /**
     * Get Context
     *
     * @return mixed
     */
    public function getContext($id = null)
    {
        if($id) {
            return isset($this->context[$id]) ? $this->context[$id]  : null;
        }

        return $this->context;
    }

    /**
     * Determine if widget has a context
     *
     * @return boolean
     */
    public function hasContext($id)
    {
        return isset($this->context[$id]);
    }
}