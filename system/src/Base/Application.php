<?php namespace Drafterbit\Base;

use Monolog\Logger;
use ReflectionClass;
use ReflectionParameter;
use Symfony\Component\Routing\Route;
use Drafterbit\Base\Event\ResponseEvent;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Drafterbit\Component\Http\Request as DrafterbitRequest;
use Drafterbit\Base\Provider\ExceptionServiceProvider;

abstract class Application extends Container implements HttpKernelInterface {
    use RootTrait;

    /**
     * Current application version.
     *
     * @var string
     */
    const VERSION = '0.1.0';

    /**
     * Booted event
     *
     * @var bool
     */
    protected $booted = false;

    /**
     * Application extensions.
     *
     * @var array
     */
    protected $extensions = [];

    /**
     * Application middlewares.
     *
     * @var array
     */
    protected $middlewares = [];

    /**
     * Application Constructor, build things.
     *
     * @param Composer\Autoload\ClassLoader
     */
    public function __construct($environment = 'development', $debug = true)
    {
        parent::__construct();
        
        $this['path']        = $this->getRoot();
        $this['debug']       = $debug;
        $this['environment'] = $environment;
        $this['path.config'] = $this->getResourcesPath('config');

        $this->register(new ExceptionServiceProvider);
        $this['exception']->register($this['environment']);

        foreach (require __DIR__ . '/Resources/services.php'
            as $provider => $services) {
            
            if(is_array($services)) {
                $this->addDeferred($provider, $services);
            } else {
                $this->register(new $services);
            }
        }
        
        array_map(function($helper) {
            $path = __DIR__."/Resources/helpers/$helper.php";
            $this['helper']
                ->register($helper, $path)
                ->load($helper);
        }, ['string', 'app', 'view']);

        ApplicationTrait::setInstance($this['app'] = $this);
    }

    /**
     * Booting
     *
     * @return void
     */
    protected function boot()
    {
        $this['dispatcher']->dispatch('boot');
        
        foreach ($this->providers as $provider) {
            if(method_exists($provider, 'boot')) {
                $provider->boot($this);
            }
        }

        $this->booted = true;
    }

    /**
     * Register single extension.
     *
     * @param string | Drafterbit\Base\Extension
     */
    public function addExtension(Extension $extension)
    {
        $name = $extension->getName();

        if($this->booted) {
            throw new \RuntimeException("Can't add an extension: $name after boot");
        }

        $this->extensions[$name] = $extension;

        if(method_exists($extension, 'boot')) {
            $this['dispatcher']->addListener('boot', [$extension, 'boot']);
        }
        
        //config
        $this['config']->setDeferredPath($name, $extension->getResourcesPath('config'));

        //services
        if (is_file($extension->getResourcesPath('config/services.php'))) {
            $defers = require $extension->getResourcesPath('config/services.php');
            foreach ($defers as $provider => $services) {
                $this->addDeferred($provider, $services);
            }
        }

        foreach ($this['config']['routes@'.$name] as $key => $value) {
            $this['router']->addRouteDefinition($key, $value);
        }

        //translator
        if (is_dir($extension->getResourcesPath('l10n'))) {
            $this['translator']->addPath($extension->getResourcesPath('l10n'));
        }
        
        // template
        if (is_dir( $path = $extension->getResourcesPath('views'))) {
            $this['template']->addPath($name, $path);
        }

        //asset path
        if (is_dir( $path = $extension->getResourcesPath('public'))) {
            $this['asset']->addPath($name, $path);
        }

        return $extension;
    }

    /**
     * Get single extension by given name.
     *
     * @param string $name
     */
    public function getExtension($name)
    {
        return isset($this->extensions[$name]) ? $this->extensions[$name] : false;
    }

    /**
     * Get registered extensions.
     *
     * @param string $key
     */
    public function getExtensions()
    {
        return $this->extensions;
    }

    /**
     * Run the Application.
     *
     * @return void
     */
    public function run()
    {
        $this->boot();

        $response = $this->setupKernel()->handle(request());

        $this->prepareResponse($response)->send();
    }

    /**
     * Prepare and add queued cookie to response
     *
     * @param Symfony\Component\HttpFoundation\Response
     * @return Symfony\Component\HttpFoundation\Response
     */
    private function prepareResponse($response)
    {
        ($response instanceof Response) or $response = new Response($response);

        $this['dispatcher']->dispatch('cookie.queues', new ResponseEvent($response));

        return $response;
    }

    /**
     * Setup midlewares.
     *
     * @return \Stack\Builder
     */
    protected function setupKernel()
    {
        $stack = (new \Stack\Builder)
                    ->push('Drafterbit\\Base\\Middlewares\\Session', $this['session'])
                    ->push('Drafterbit\\Base\\Middlewares\\Router', $this);

        foreach ($this->middlewares as $middleware) {

            list($class, $parameters) = array_values($middleware);

            array_unshift($parameters, $class);

            call_user_func_array([$stack, 'push'], $parameters);
        }

        return $stack->resolve($this);
    }

    /**
     * Add a HttpKernel middleware(s).
     *
     * @param  string  $class
     * @param  array  $parameters
     * @return \Drafterbit\Base\Application
     */
    public function addMiddleware($class, array $parameters = [])
    {
        $this->middlewares[] = compact('class', 'parameters');

        return $this;
    }

    /**
     * {@inheritdoc}
     *
     * @api
     */
    public function handle(Request $request, $type = self::MASTER_REQUEST, $catch = true)
    {
        try {

            return $this->handleRaw($request);

        } catch( \Exception $e ) {
            $this['exception']->handleException($e);
        }
    }

    private function handleRaw($request)
    {
        if(! $request instanceof DrafterbitRequest and
                !$request->getMatchingRoute()) {
            throw new \Exception("Error Processing Request");
        }

        $controller = $request->getMatchingRoute()->getDefault('controller');
            
        if(is_string($controller)) {
            
            $controller = $this->parseNamespace($controller, '\\Controllers\\');

            list($controller, $method) = explode('::', $controller);

            $controller = [$this->build($controller), $method];
        }

        $args = array_values($request->getMatchingRoute()->getParameters());
        
        return call_user_func_array($controller, $args);
    }

    /**
     * Parse extension namespaces
     *
     * @param string @string
     * @return string
     * @todo move this to extension manager
     */
    public function parseNamespace($string, $mid = '\\')
    {
        if($string[0] == '@') {

            $temp = explode('\\', $string);

            $name = ltrim(array_shift($temp),'@');
            $class = implode('\\', $temp);

            if($extension = $this->getExtension($name)) {

                $namespace = $extension->getNamespace();
                $string = $namespace.$mid.$class;
            }
        }

        return $string;
    }

    /**
     * Build a class
     *
     * @param string $class
     * @return object
     */
    public function build($class, $parameters = [])
    {
        return $this['builder']->build($class, $parameters);
    }

    /**
     * Determine if we are running in the console.
     *
     * @return bool
     */
    public function runningInConsole()
    {
        return php_sapi_name() == 'cli';
    }
}