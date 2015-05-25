<?php namespace Drafterbit\Base;

trait ContainerTrait {

    /**
     * The service instance
     *
     * @var array
     */
    protected static $instance;

    /**
     * Get the application instance.
     *
     * @param  string $name
     * @param  mixed $value
     * @return object
     */
    public static function getInstance($service = null)
    {
        return is_null($service) ? static::$instance : static::$instance[$service];
    }

    /**
     * Set the application instance.
     *
     * @param  string $name
     * @param  mixed $value
     * @param  mixed $instance
     * @return object
     */
    public static function setInstance(Container $instance = null)
    {
        return static::$instance = $instance;
    }

    /**
     * Whether an application parameter or an object exists.
     *
     * @param  string $offset
     * @return mixed
     */
    public function offsetExists($offset)
    {
        return isset(static::$instance[$offset]);
    }

    /**
     * Gets an application parameter or an object.
     *
     * @param  string $offset
     * @return mixed
     */
    public function offsetGet($offset)
    {
        return static::$instance[$offset];
    }

    /**
     * Sets an application parameter or an object.
     *
     * @param  string $offset
     * @param  mixed  $value
     */
    public function offsetSet($offset, $value)
    {
        static::$instance[$offset] = $value;
    }

    /**
     * Unsets an application parameter or an object.
     *
     * @param  string $offset
     */
    public function offsetUnset($offset)
    {
        unset(static::$instance[$offset]);
    }
}