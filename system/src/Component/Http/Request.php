<?php namespace Drafterbit\Component\Http;

use Symfony\Component\HttpFoundation\Request as BaseRequest;
use Symfony\Component\Routing\Route;
use Drafterbit\Component\Routing\Router;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Exception\MethodNotAllowedException;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;


class Request extends BaseRequest {

	/**
	 * Request created from globals.
	 *
	 * @var object
	 */
	public static $fromGlobals;

	/**
	 * Request simulated.
	 */
	public static $simulated;

	/**
	 * Matching route
	 */
    protected $matchingRoute;

    protected $router;

    /**
     * Simulate request
     *
     * @return object
     */
    public static function simulate(
    	$uri,
    	$method = 'GET',
    	$parameters = array(),
    	$cookies = array(),
    	$files = array(),
    	$server = array(),
    	$content = null)
    {
    	return static::$simulated = static::create(
	    	$uri,
	    	$method,
	    	$parameters,
	    	$cookies,
	    	$files,
	    	$server,
	    	$content);
    }

    public function setRouter(Router $router)
    {
    	$this->router = $router;
    }

    /**
     * Get request instance either from globals or simulated
     *
     * @return object
     */
    public static function getInstance() {
    	if(static::$simulated) {
    		return static::$simulated;
    	}

    	if(!static::$fromGlobals) {
    		static::$fromGlobals = static::createFromGlobals();
    	}

    	return static::$fromGlobals;
    }

    public function getMatchingRoute()
    {
    	if(!$this->router) {
    		throw new \Exception("Request have no router yet");
    	}

    	if($this->matchingRoute) {
    		return $this->matchingRoute;
    	}

    	$parameters = $this->getMatchingRouteParameters();

    	$route = $this->router->getRoute($parameters['_route']);

        $route->setParameters($parameters);

    	return $this->matchingRoute = $route;
    }

    public function getMatchingRouteParameters()
    {
  		$path = $this->getPathInfo();
    	
    	try {
	        return $this->router->getUrlMatcher($this)->match($path);

        } catch(\Exception $e) {
            
            // we will simplifize this, if no route found
            // the we will just say it not found 
            if($e instanceof MethodNotAllowedException
                or $e instanceof ResourceNotFoundException) {

                    $method = $this->getMethod();

                    throw new NotFoundHttpException("Route $method $path not found");
            }

            throw $e;
        }
    }
}