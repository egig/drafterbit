<?php namespace Drafterbit\Base;

use Pimple\Container as BaseContainer;
use Pimple\ServiceProviderInterface;

class Container extends BaseContainer {

	/**
     * Registered service providers.
     *
     * @var array
     */
    protected $providers;

    /**
     * Deferred service providers.
     *
     * @var array
     */
    protected $deferred = [];

	/**
     * Get the value at a given offset. Overrides Pimples.
     *
     * @param  string  $key
     * @return mixed
     */
    function offsetGet($key)
    {
        if (isset( $this->deferred[$key]) ) {
            $this->registerDeferred($key);
        }

        return parent::offsetGet($key);
    }

    /**
     * Register a service provider with the application.
     *
     * @param  \Drafterbit\Base\Kernel\ServiceProvider|string  $provider
     * @param  array  $options
     * @return void
     */
    public function register( ServiceProviderInterface $provider, array $options = [])
    {
        $this->providers[] = get_class($provider);

        parent::register($provider, $options);
    }

    /**
     * Load the provider for a deferred service.
     *
     * @param  string  $service
     * @return void
     */
    protected function registerDeferred($service)
    {
        $provider = $this->deferred[$service];

        if (!in_array($provider, $this->providers)) {
            
            $instance = new $provider;
            $this->register($instance);

            unset($this->deferred[$service]);
        }
    }


    /**
     * Add deferred provider
     *
     * @param array $providers
     * @return void
     */
    public function addDeferred($provider, $service)
    {
        $services = (array) $service;

        foreach ($services as $service) {
            $this->deferred[$service] =  $provider;
        }

        return $this;
    }
}