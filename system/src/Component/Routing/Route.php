<?php namespace Drafterbit\Component\Routing;

use Closure;
use Drafterbit\Component\Http\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Route as BaseRoute;

class Route extends BaseRoute {

    /**
     * @var null|CompiledRoute
     */
    private $compiled;

    /**
     * The matching parameter array.
     *
     * @var array
     */
    protected $parameters;

    /**
     * The parsed parameter array.
     *
     * @var array
     */
    protected $parsedParameters;

    public function __construct($path, array $defaults = [], array $requirements = [], array $options = [], $host = '', $schemes = [], $methods = [], $condition = null)
    {
        parent::__construct($path, $defaults, $requirements, $options, $host, $schemes, $methods, $condition);
    }

    /**
     * Get a parameter by name from the route.
     *
     * @param  string  $name
     * @param  mixed   $default
     * @return string
     */
    public function getParameter($name, $default = null)
    {
        return array_get($this->getParameters(), $name, $default);
    }

    /**
     * Get the parameters to the callback.
     *
     * @return array
     */
    public function getParameters()
    {
        if (isset($this->parsedParameters)) {
            return $this->parsedParameters;
        }

        $variables = $this->compile()->getVariables();

        $parameters = [];

        foreach ($variables as $variable) {
            $parameters[$variable] = $this->resolveParameter($variable);
        }

        return $this->parsedParameters = $parameters;
    }

    /**
     * Resolve a parameter value for the route.
     *
     * @param  string  $key
     * @return mixed
     */
    protected function resolveParameter($key)
    {
        $value = $this->parameters[$key];

        return $value;
    }

    /**
     * Get the route parameters without missing defaults.
     *
     * @return array
     */
    public function getParametersWithoutDefaults()
    {
        $parameters = $this->getParameters();

        foreach ($parameters as $key => $value) {
            if ($this->isMissingDefault($key, $value)) {
                unset($parameters[$key]);
            }
        }

        return $parameters;
    }

    /**
     * Determine if a route parameter is really a missing default.
     *
     * @param  string  $key
     * @param  mixed   $value
     * @return bool
     */
    protected function isMissingDefault($key, $value)
    {
        return $this->isOptional($key) and is_null($value);
    }

    /**
     * Determine if a given key is optional.
     *
     * @param  string  $key
     * @return bool
     */
    public function isOptional($key)
    {
        return array_key_exists($key, $this->getDefaults());
    }

    /**
     * Get the keys of the variables on the route.
     *
     * @return array
     */
    public function getParameterKeys()
    {
        return $this->compile()->getVariables();
    }

    /**
     * Set the default value for a parameter.
     *
     * @param  string  $key
     * @param  mixed   $value
     * @return \Drafterbit\Component\Routing\Route
     */
    public function defaults($key, $value)
    {
        $this->setDefault($key, $value);

        return $this;
    }

    /**
     * Set the matching parameter array on the route.O
     *
     * @param  array  $parameters
     * @return void
     */
    public function setParameters($parameters)
    {
        $this->parameters = $parameters;
    }

    /**
     * {$inheritdoc}
     */
    public function addOptions(array $options)
    {
        foreach ($options as $name => $option) {
            if(!$this->hasOption($name)) {
                $this->setOption($name, $option);
            }
        }

        $this->compiled = null;

        return $this;
    }
}