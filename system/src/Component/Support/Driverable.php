<?php namespace Drafterbit\Component\Support;

use Closure;

abstract class Driverable {

    /**
     * the config for the manager
     *
     * @var config
     */
    protected $config;

    /**
     * The registered custom driver creators.
     *
     * @var array
     */
    protected $extensions = [];

    /**
     * The array of created "drivers".
     *
     * @var array
     */
    protected $drivers = [];

    /**
     * Create a new manager instance.
     *
     * @param  \Drafterbit\Component\Foundation\Application  $app
     * @return void
     */
    public function __construct($config)
    {
        $this->config = $config;
    }

    /**
     * Get a driver instance.
     *
     * @param  string  $driver
     * @return mixed
     */
    public function driver($driver = null)
    {
        $driver = $driver ?: $this->getDefaultDriver();

        if (!isset($this->drivers[$driver])) {
            $this->drivers[$driver] = $this->createDriver($driver);
        }

        return $this->drivers[$driver];
    }

    /**
     * Create a new driver instance.
     *
     * @param  string  $driver
     * @return mixed
     */
    protected function createDriver($driver)
    {
        if (isset($this->extensions[$driver])) {
            return $this->buildExtension($driver);
        }

        $method = strtolower($driver).'Driver';

        if (method_exists($this, $method)) {
            return $this->$method();
        }

        throw new \InvalidArgumentException("Driver [$driver] not supported.");
    }

    /**
     * Call a custom driver creator.
     *
     * @param  string  $driver
     * @return mixed
     */
    protected function buildExtension($driver)
    {
        return $this->extensions[$driver]($this->config);
    }

    /**
     * Register a custom driver creator Closure.
     *
     * @param  string   $driver
     * @param  Closure  $callback
     * @return void
     */
    public function extend($driver, Closure $callback) {
        $this->extensions[$driver] = $callback;
    }

    /**
     * Get all of the created "drivers".
     *
     * @return array
     */
    public function getDrivers() {
        return $this->drivers;
    }

    /**
     * Get default driver for manager
     *
     * @return mixed
     */
    protected function getDefaultDriver() {
        throw new \RuntimeException("{get_called_class() does not implement getDefaultDriver method.");
    }

    /**
     * Dynamically call the default driver instance.
     *
     * @param  string  $method
     * @param  array   $parameters
     * @return mixed
     */
    public function __call($method, $parameters)
    {
        return call_user_func_array([$this->driver(), $method], $parameters);
    }

}