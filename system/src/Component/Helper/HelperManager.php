<?php namespace Drafterbit\Component\Helper;

class HelperManager {

    /**
     * Loaded helpers.
     *
     * @var array
     */
    protected $loaded = [];

    /**
     * Available helpers.
     *
     * @var array
     */
    protected $helpers = [];

    /**
     * Load all available helper.
     *
     * @return object
     */
    public function loadAll()
    {
        foreach ($this->helpers as $name => $file) {
            $this->load($name);
        }
    }

    /**
     * Load named helper.
     *
     * @param string $name
     */
    public function load($name)
    {
        if( ! isset($this->loaded[$name]) ) {
            require $this->helpers[$name];
            $this->loaded[$name] = true;
        }
    }

    /**
     * Add helper file.
     *
     * @param string $name
     * @param string $file
     */
    public function register($name, $file)
    {
        $this->helpers[$name] = $file;

        return $this;
    }
}