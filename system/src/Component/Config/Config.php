<?php namespace Drafterbit\Component\Config;

use ArrayAccess;
use Drafterbit\Component\Config\Loader\LoaderInterface;
use Drafterbit\Component\Config\Loader\ArrayLoader;

class ConfigFileNotFoundException extends \Exception {}

class Config implements ArrayAccess {

    /**
     * The deferred path to look or file.
     *
     * @var array
     */
    protected $deferredPath;

    /**
     * array config per files.
     *
     * @var array
     */
    protected $files = [];

    /**
     * Loader.
     *
     * @var Drafterbit\Component\Config\Loader\LoaderInterface
     */
    protected $loader;

    /**
     * Items.
     *
     * @var array
     */
    protected $items = [];

    /**
     * Replaces
     *
     * @var array
     */
    protected $replaces = [];

    /**
     * The path to look or file.
     *
     * @var string
     */
    protected $path;

    /**
     * File returned.
     *
     * @var string
     */
    protected $resolvedFilePath;

    /**
     * Possible context
     *
     * @var string
     */
    protected $context;

    /**
     * resolved item.
     *
     * @var string
     */
    protected $resolved = [];

    /**
     * Parse state
     *
     * @var bool
     */
    protected $parsed = false;

    /**
     * array config per files.
     *
     * @var sstring
     */
    protected $extension = '.php';

    /**
     * constructor.
     *
     * @param  string  $path
     * @return void
     */

    public function __construct($path, $context = null, LoaderInterface $loader = null)
    {
        $this->loader = is_null($loader) ? new ArrayLoader : $loader;
        $this->extension = $this->resolveFileExtension($this->loader);

        $this->path = $path;
        $this->context = $context;
    }

    /**
     * Parse given key.
     *
     * @param string $key;
     */
    public function parse($key, $path = null)
    {
        if (!$path ) {
            $path = $this->path;
        }

        if (!isset( $this->resolved[ $key ] )) {
            $this->resolved[$key] = $this->doParse( $key, $path);
            $this->parsed     = true;
        }

        return $this->resolved[ $key ];
    }

    /**
     * Determines portion of given key.
     *
     * @param  string  $key
     * @param  string  $path
     * @param  string  $return
     * @return array (file, items)
     */

    private function doParse($key, $path)
    {
        $segments = explode('.', $key);
        $_temp = '';
        $file  = null;
        $path = rtrim($path,'/');

        for ($i=0;$i<count($segments);$i++) {
            
            $_temp     .= '/'. $segments[$i];
            $desired = ltrim($_temp . $this->extension, '/');
            $default     = $path .'/'. $desired;
            $inContext     = $path .'/'. $this->context .'/'. $desired;

            if (is_file( $inContext ) ) {
                $file = $inContext;
                break;
            } else if (is_file($default)) {
                $file = $default;
                break;
            }
        }

        unset($_temp);
        if (is_null($file)) {
            throw new ConfigFileNotFoundException("No file or value found for key '$key'");
        }

        $this->resolvedFilePath = $file;
        $item = isset($segments[$i+1]) ? implode('.', array_slice($segments, $i+1)) : null;        
        return $item;
    }

    /**
     * Get File path;
     *
     * @return string
     */
    public function getResolvedFilePath()
    {
        if(!$this->parsed)
        {
            return null;
        }
        return $this->resolvedFilePath;
    }

    /**
     * Resolve file extension according to loader.
     *
     * @param Drafterbit\Component\Config\Loader\LoaderInterface
     * @return string
     */
    protected function resolveFileExtension(LoaderInterface $loader)
    {
        return $loader->getFileExtension();
    }

    /**
     * Determine if the given configuration value exists.
     *
     * @param  string  $key
     * @return bool
     */
    public function has($key)
    {
        $default = microtime(true);

        return $this->get($key, $default) !== $default;
    }

    /**
     * Get the specified configuration value.
     *
     * @param  string  $key
     * @param  mixed   $default
     * @return mixed
     */
    public function get($key, $default = null)
    {
        if(isset($this->items[$key])) {
            return $this->items[$key];
        }

        if (strpos($key, '@')) {
            $temp         = explode('@', $key);
            $key         = current($temp);
            $extension     = end($temp);
            $path = $this->getDeferredPath($extension);
            $item = $this->parse($key, $path);
            $file = $this->getResolvedFilePath();
        } else {
            $item = $this->parse($key);
            $file = $this->getResolvedFilePath();
        }

        $array = $this->files[$file] = $this->load($file);

        $value = $this->arrayGet($array, $item, $default);

        return $this->items[$key] = $this->replace($value);
    }

    /**
     * Set a given configuration value.
     *
     * @param  string  $key
     * @param  mixed   $value
     * @return void
     */
    public function set($key, $value)
    {
        $this->items[$key] =  $this->replace($value);

        $this->arraySet($this->items, $key, $value);
        return $this;
    }

    /**
     * load config array
     *
     * @param  string  $path
     * @return array or null
     */

    public function load($path)
    {
        if(isset($this->files[$path])) {
            return $this->files[$path];
        }

        $array = $this->loader->load($path);

        if(!is_array($array)) {

            $class = get_class($this->loader);
            throw new \RuntimeException("'load' method of class $class must return array");
        }

        return $this->files[$path] = $array;
    }

    /**
     * Get the current configuration environment.
     *
     * @return string
     */
    public function getContext()
    {
        return $this->context;
    }

    /**
     * Determine if the given configuration option exists.
     *
     * @param  string  $key
     * @return bool
     */
    public function offsetExists($key)
    {
        return $this->has($key);
    }

    /**
     * Get a configuration option.
     *
     * @param  string  $key
     * @return bool
     */
    public function offsetGet($key)
    {
        return $this->get($key);
    }

    /**
     * Set a configuration option.
     *
     * @param  string  $key
     * @param  string  $value
     * @return void
     */
    public function offsetSet($key, $value)
    {
        $this->set($key, $value);
    }

    /**
     * Unset a configuration option.
     *
     * @param  string  $key
     * @return void
     */
    public function offsetUnset($key)
    {
        $this->set($key, null);
    }

    /**
     * Set current path to look the value.
     *
     * @param string $name
     * @param string $path
     */
    public function setDeferredPath( $name, $path )
    {
        $this->deferredPath[$name] = $path;
    }

    /**
     * Get deferred path by given name.
     *
     * @param $name
     */
    public function getDeferredPath($name)
    {
        return $this->deferredPath[$name];
    }

    /**
     * Get an item from an array using "dot" notation.
     *
     * @param  array   $array
     * @param  string  $key
     * @param  mixed   $default
     * @return mixed
     */
    protected function arrayGet($array, $key, $default = null)
    {
        if (is_null($key)) return $array;
        if (isset($array[$key])) return $array[$key];

        foreach (explode('.', $key) as $segment) {
            if ( ! is_array($array) or ! array_key_exists($segment, $array)) {
                return $default;
            }

            $array = $array[$segment];
        }

        return $array;
    }

    /**
     * Set an array item to a given value using "dot" notation.
     *
     * If no key is given to the method, the entire array will be replaced.
     *
     * @param  array   $array
     * @param  string  $key
     * @param  mixed   $value
     * @return array
     */
    protected function arraySet(&$array, $key, $value)
    {
        if (is_null($key)) return $array = $value;

        $keys = explode('.', $key);

        while (count($keys) > 1) {
            $key = array_shift($keys);

            // If the key doesn't exist at this depth, we will just create an empty array
            // to hold the next value, allowing us to create the arrays to hold final
            // values at the correct depth. Then we'll keep digging into the array.
            if ( ! isset($array[$key]) or ! is_array($array[$key])) {
                $array[$key] = [];
            }

            $array =& $array[$key];
        }

        $array[array_shift($keys)] = $value;

        return $array;
    }

    /**
     * Replace "%foo%" placeholders with the actual value.
     *
     * @param  mixed $value
     * @return mixed
     */
    protected function replace($value)
    {
        if (!$this->replaces) {
            return $value;
        }

        if (is_array($value)) {
            foreach ($value as $k => $v) {
                $value[$k] = $this->replace($v);
            }

            return $value;
        }

        if (is_string($value)) {
            return strtr($value, $this->replaces);
        }

        return $value;
    }

    /**
     * add replaces route key definition
     *
     * @param array
     */
    public function addReplaces($key, $value)
    {
        $this->replaces[$key] = $value;
    }
}