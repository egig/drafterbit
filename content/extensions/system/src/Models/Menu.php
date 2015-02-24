<?php namespace Drafterbit\Extensions\System\Models;

class Menu
{

    public $label;
    public $href = '#';
    public $id;
    public $class;
    public $children = [];

    public function __construct($label, $href, $id, $class)
    {
        $this->label = __($label); // #translated
        
        $this->href = $href;
        $this->id = $id;
        $this->class = $class;
    }

    public function getChildren()
    {
        return $this->children;
    }

    public function hasChildren()
    {
        return count($this->children) > 0;
    }
}
