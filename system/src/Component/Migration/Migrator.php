<?php namespace Drafterbit\Component\Migration;

class Migrator
{
    /**
     * @var array
     */
    protected $globals = [];

    /**
     * @var string
     */
    protected $pattern = '/^(?<version>.+)\.php$/';

    /**
     * Gets all global parameters.
     *
     * @return array
     */
    public function getGlobals()
    {
        return $this->globals;
    }

    /**
     * Adds a global parameter.
     *
     * @param string $name
     * @param mixed  $value
     */
    public function addGlobal($name, $value)
    {
        $this->globals[$name] = $value;
    }

    /**
     * Gets the migration file pattern.
     *
     * @return array
     */
    public function getPattern()
    {
        return $this->pattern;
    }

    /**
     * Sets the migration file pattern.
     *
     * @param string $pattern
     */
    public function setPattern($pattern)
    {
        $this->pattern = $pattern;
    }

    /**
     * Creates a migration object.
     *
     * @param  string $path
     * @param  string $current
     * @param  array  $parameters
     * @return Migration
     */
    public function create($path, $current = null, $parameters = [])
    {
        return new Migration($this, $path, $current, $parameters);
    }
}
