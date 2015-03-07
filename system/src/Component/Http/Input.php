<?php namespace Drafterbit\Component\Http;

use Symfony\Component\HttpFoundation\Request as BaseRequest;

class Input {

    /**
     * Request Object.
     *
     * @var \Symfony\Component\HttpFoundation\Request
     */
    protected $request;

    /**
     * Constructor.
     *
     * @param \Symfony\Component\HttpFoundation\Request
     */
    public function __construct( BaseRequest $request = null)
    {
        $this->request = is_null($request) ? BaseRequest::createFromGlobals() : $request;
    }

    /**
     * Get Request object.
     * 
     * @return \Symfony\Component\HttpFoundation\Request
     */
    public function getRequest()
    {
        return $this->request;
    }

    /**
     * Set Request object to handle.
     * 
     * @return \Symfony\Component\HttpFoundation\Request
     */
    public function setRequest( $request )
    {
        $this->request = $request;
    }

    /**
     * Helper to fetch values.
     *
     * @param Symfony\Component\HttpFoundation\AttributeBag $symfonyAttr
     * @param string $name
     * @param mixed $default
     */
    private function doFetch($symfonyAttr, $name, $default)
    {
        return is_null($name)
            ? $this->request->$symfonyAttr->all()
            : $this->request->$symfonyAttr->get($name, $default);
    }


    /**
     * Get any-request bag.
     *
     * @return \Symfony\Component\HttpFoundation\ParameterBag
     */
    public function request($name = null, $default = null)
    {
        return $this->request->get($name, $default);
    }

    /**
     * Get post-request bag.
     *
     * @param string $name
     * @param mixed $default
     * 
     * @return \Symfony\Component\HttpFoundation\ParameterBag
     */
    public function post($name = null, $default = null)
    {
        return $this->doFetch('request', $name, $default);
    }

    /**
     * Get get-request bag.
     *
     * @param string $name
     * @param mixed $default
     * 
     * @return \Symfony\Component\HttpFoundation\ParameterBag
     */
    public function get($name = null, $default = null)
    {
        return $this->doFetch('query', $name, $default);
    }

    /**
     * Get server-request bag.
     * 
     * @param string $name
     * @param mixed $default
     *
     * @return \Symfony\Component\HttpFoundation\ParameterBag
     */
    public function cookies($name = null, $default = null)
    {
        return $this->doFetch('cookies', $name, $default);
    }

    /**
     * Get server-request bag.
     * 
     * @param string $name
     * @param mixed $default
     *
     * @return \Symfony\Component\HttpFoundation\ServerBag
     */
    public function server($name = null, $default = null)
    {
        return $this->doFetch('server', $name, $default);
    }

    /**
     * Get files-request bag.
     * 
     * @param string $name
     * @param mixed $default
     *
     * @return \Symfony\Component\HttpFoundation\FileBag
     */
    public function files($name = null, $default = null)
    {
        return $this->doFetch('files', $name, $default);
    }

    /**
     * Get header-request bag.
     * 
     * @param string $name
     * @param mixed $default
     *
     * @return \Symfony\Component\HttpFoundation\HeaderBag
     */
    public function headers($name = null, $default = null)
    {
        return $this->doFetch('headers', $name, $default);
    }

    /**
     * Check if coming request is an ajax
     *
     * @return boolean
     */
    public function isAjax()
    {
        return $this->request->isXmlHttpRequest();
    }

    /**
     * Dinamically handle call action
     *
     * @return mixed
     */
    public function __call($method, $parameters)
    {
        return call_user_func_array([$this->request, $method], $parameters);
    }
}