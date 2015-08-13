<?php

namespace Drafterbit\System\Extension;

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

	/**
	 * Register Extension
	 *
	 * @param Extension $extension
	 */	
	public function registerExtension(Extension $extension)
	{
		$this->extensions[$extension->getName()] = $extension;
	}

	/**
     * Data shared from extension.
     *
     * @return array
     */
    function getData($section)
    {
        if(isset($this->data[$section])) {
            return $this->data[$section];
        }

        // make sudly case
        $section = ucwords(str_replace(['-', '_'], ' ', $section));
        $section = str_replace(' ', '', $section);

        $method = 'get'.$section.'Extension';

        $data = [];
        foreach ($this->extensions as $name => $instance) {
            if (method_exists($instance, $method)) {
                $data =  array_merge($data, $instance->$method());
            }
        }

        return $this->data[$section] = $data;
    }
}