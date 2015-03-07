<?php namespace Drafterbit\Base\Middlewares;

use Drafterbit\Base\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;

class Router implements HttpKernelInterface {

    /**
     * The wrapped kernel implementation.
     *
     * @var \Symfony\Component\HttpKernel\HttpKernelInterface
     */
    protected $kernel;

    /**
     * Darafterbit Application
     *
     * @var \Drafterbit\Base\Application
     */
    protected $app;

    /**
     * Create a new session middleware.
     *
     * @param  \Symfony\Component\HttpKernel\HttpKernelInterface  $app
     * @param  \Drafterbit\Component\Routing\Router  $router
     * @return void
     */
    public function __construct(HttpKernelInterface $kernel, Application $app)
    {
        $this->kernel = $kernel;
        $this->app = $app;
    }

    /**
     * Handle the given request and get the response.
     *
     * @implements HttpKernelInterface::handle
     *
     * @param  \Symfony\Component\HttpFoundation\Request  $request
     * @param  int   $type
     * @param  bool  $catch
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, $type = HttpKernelInterface::MASTER_REQUEST, $catch = true)
    {
        $request->setRouter($this->app['router']);

        $route = $request->getMatchingRoute();

        $beforeCallbacks = (array) $route->getOption('before');
        foreach ($beforeCallbacks as $callback) {
            call_user_func_array($this->createRouteCallback($callback), [$route, $request]);
        }

        $response = $this->kernel->handle($request, $type, $catch);

        $afterCallbacks = (array) $route->getOption('after');
        foreach ($afterCallbacks as $callback) {
            call_user_func_array($this->createRouteCallback($callback), [$route, $response]);
        }
        
        return $response;
    }

    /**
     * Create route callback.
     *
     * @param string
     */
    public function createRouteCallback($string)
    {
        $string = $this->app->parseNamespace($string);
        list($class, $method) = explode('::', $string);

        $class =  $this->app->build($class);

        return function($route, $request) use ($class, $method) {
            return call_user_func_array([$class, $method], [$route, $request]);
        };
    }
}