<?php

namespace Drafterbit\System\Extension;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;

class ExtensionManager
{
    /**
     * Registered extension
     * 
     * @var Extension[]
     */
    protected $extensions = [];

    /**
     * Populated extensions data.
     *
     * @var array
     */
    protected $data;


    public function __construct(ContainerInterface $container)
    {
        $this->container  = $container;
    }

    /**
     * Register Extension
     *
     * @param Extension $extension
     */    
    public function registerExtension(Extension $extension)
    {
        $name = $extension->getName();
        if(isset($this->extensions[$name])) {
            throw new \InvalidArgumentException("Extension with name '$name' already exists");
        }

        $this->extensions[$name] = $extension;
    }

    /**
     * Data shared from extension.
     *
     * @return array
     */
    function get($section)
    {
        if(isset($this->data[$section])) {
            return $this->data[$section];
        }

        $method = 'get'.static::studly($section);

        $data = [];
        foreach ($this->extensions as $name => $instance) {
            if (method_exists($instance, $method)) {
                $data =  array_merge($data, $instance->$method());
            }
        }

        array_map(function($item){
            if($item instanceof ContainerAwareInterface) {
                $item->setContainer($this->container);
            }
        }, $data);

        return $this->data[$section] = $data;
    }

    public static function studly($string)
    {
        $string = ucwords(str_replace(['-', '_'], ' ', $string));
        return str_replace(' ', '', $string);
    }
}