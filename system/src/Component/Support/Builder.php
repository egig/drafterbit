<?php namespace Drafterbit\Component\Support;

use ReflectionClass;
use ReflectionParameter;

class Builder {

    /**
     * Instantiate a class.
     *
     * @param  string  $class
     * @param  array   $parameters
     * @return mixed
     */
    public function build($class, $parameters = [])
    {
        $reflector = new ReflectionClass($class);

        if (!$reflector->isInstantiable()) {
            throw new \Exception("Target [$class] is not instantiable.");
        }

        $constructor = $reflector->getConstructor();

        if (is_null($constructor)) {
            return new $class;
        }

        $resolvables = array_diff_key($constructor->getParameters(), $parameters);

        $deps = [];
        foreach ($resolvables as $param) {
            $deps[] = $this->resolveParameter($param);
        }

        return $reflector->newInstanceArgs(array_merge($parameters, $deps));
    }


    /**
     * Resolve the dependencies from the ReflectionParameter.
     *
     * @param  mixes $parameters
     * @return array
     */
    private function resolveParameter($parameter)
    {
        $dependency = $parameter->getClass();

        if (is_null($dependency)) {
            
            // parameter is not a class
            if ($parameter->isDefaultValueAvailable()) {
                 return $parameter->getDefaultValue();
            
            } else {
                throw new \Exception("Unresolvable dependency resolving [$parameter].");
            }

        } else {

            // paramter is a class, do build again
            return $this->resolveClass($parameter);
        }
    }

    /**
     * Resolve a class based dependency from the container.
     *
     * @param  \ReflectionParameter  $parameter
     * @return mixed
     */
    private function resolveClass(ReflectionParameter $parameter)
    {
        try {
            return $this->build($parameter->getClass()->name);
        } catch (\Exception $e) {
            if ($parameter->isOptional()) {
                return $parameter->getDefaultValue();
            } else {
                throw $e;
            }
        }
    }
}