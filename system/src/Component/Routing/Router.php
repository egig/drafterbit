<?php namespace Drafterbit\Component\Routing;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Routing\Exception\ExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Matcher\Dumper\PhpMatcherDumper;

class Router {

    protected $routeOptionKeys = ['auth', 'access'];
    
    /**
     * The route collection instance.
     *
     * @var Symfony\Component\Routing\RouteCollection
     */
    protected $routes;

    /**
     * The current route being executed.
     *
     * @var \Drafterbit\Component\Routing\Route
     */
    protected $route;

    /**
     * Replaces.
     *
     * @var array
     */
    protected $replaces = [];

    /**
     * Array Route Definition.
     *
     * @var array
     */
    protected $routeArray = [];

    /**
     * Cache directory
     *
     * @var string
     */
    protected  $cacheDir;

    /**
     * Url Matcher
     *
     * @var string
     */
    protected  $matcher;

    /**
     * Constructor
     *
     * @return  void
     */
    public function __construct($cacheDir = null)
    {
        $this->cacheDir = $cacheDir;
        // @todo clean and use cache
        $this->reader = new \Doctrine\Common\Annotations\AnnotationReader();
    }

    /**
     * Create a route.
     *
     * @param array $param
     */
    public function createRoute($path, $param)
    {
        if (!is_array($param)) {
            throw new \InvalidArgumentException(sprintf('The parameter for "%s" must contain an array of routes.', $path));
        }

        $host             = isset($param['host']) ? $param['host'] : '';
        $options         = isset($param['options']) ? $param['options'] : [];
        $schemes         = isset($param['schemes']) ? $param['schemes'] : [];
        $methods         = isset($param['methods']) ? $param['methods'] : [];
        $defaults         = isset($param['defaults']) ? $param['defaults'] : [];
        $condition         = isset($param['condition']) ? $param['condition'] : null;
        $requirements     = isset($param['requirements']) ? $param['requirements'] : [];

        //replace placeholder
        foreach ($requirements as $key => &$value) {
            $value = strtr($value, $this->replaces);
        }

        if(isset($param['controller'])) {
            $defaults['controller'] = $param['controller'];
        }

        $keys = ['host', 'options', 'schemes', 'methods', 'defaults', 'condition', 'requirements', 'controller'];

        foreach (array_keys($param) as $key) {
            if(!in_array($key, $keys)) {
                $options[$key] = $param[$key];
            }
        }

        return new Route($path, $defaults, $requirements, $options, $host, $schemes, $methods, $condition);
    }

    /**
     * Create Route Collection instance.
     *
     * @param array $param
     */
    public function createRouteCollection($prefix = '', $param = [])
    {
        $subRoutes         = isset($param['routes']) ? $param['routes'] : [];
        $type             = isset($param['type']) ? $param['type'] : null;
        $host             = isset($wriparam['host']) ? $param['host'] : null;
        $schemes         = isset($param['schemes']) ? $param['schemes'] : null;
        $methods         = isset($param['methods']) ? $param['methods'] : null;
        $options         = isset($param['options']) ? $param['options'] : [];
        $defaults         = isset($param['defaults']) ? $param['defaults'] : [];
        $requirements     = isset($param['requirements']) ? $param['requirements'] : [];


        if(isset($param['controller'])) {
            $defaults['controller'] = $param['controller'];
        }

        //replace place holder
        foreach ($requirements as $key => &$value) {
            $value = strtr($value, $this->replaces);
        }

        $keys = ['host', 'options', 'schemes', 'methods', 'defaults', 'condition', 'requirements', 'controller'];

        foreach (array_keys($param) as $key) {
            if(!in_array($key, $keys)) {
                $options[$key] = $param[$key];
            }
        }

        $collection =  $this->parseRoutes($subRoutes, $prefix);
        
        if (null !== $host) {
            $collection->setHost($host);
        }
        if (null !== $schemes) {
            $collection->setSchemes($schemes);
        }
        if (null !== $methods) {
            $collection->ensureMethods($methods);
        }
       
        $collection->addDefaults($defaults);
        $collection->addRequirements($requirements);
        $collection->addOptions($options);

        $collection->addPrefix($prefix);

        return $collection;
    }

    /**
     * Get the name of the route.
     *
     * @param  string  $pattern
     * @param  string  $method
     * @return string
     */
    protected function createRouteName($pattern, $method, $prefix = '')
    {
        $method = implode('_', $method);
        return "{$method}_{$prefix}{$pattern}";
    }

    /**
     * Create a new URL matcher instance.
     *
     * @param  \Symfony\Component\HttpFoundation\Request  $request
     * @return \Symfony\Component\Routing\Matcher\UrlMatcher
     */
    public function getUrlMatcher(Request $request)
    {
        if($this->matcher) {
            return $this->matcher;
        }

        $context = new RequestContext;
        $context->fromRequest($request);

        if(!$this->cacheDir) {
            return new UrlMatcher($this->getRoutes(), $context);
        }

        $class = 'DrafterbitCachedUrlMatcher';
        $path = $this->cacheDir.'/routes.php';

        if(!file_exists($path)) {

            $dumper = new PhpMatcherDumper($this->getRoutes());

            $options = [
                'class' => $class,
                'base_class' => 'Symfony\\Component\\Routing\\Matcher\\UrlMatcher'
            ];

            $this->writeCache($path, $dumper->dump($options));
        }

        require_once $path;

        return $this->matcher = new $class($context);
    }

    /**
     * Write content to a file.
     *
     * @param string $path
     * @param string $content
     */
    public function writeCache($path, $content)
    {
        if (false === file_put_contents($path, $content)) {
            throw new \RuntimeException('Unable to write file '.$path);
        }
    }

    /**
     * Build all routs defined in route config
     *
     * @param  array  $routes
     * @return \Symfony\Component\Routing\RouteCollection
     */

    public function parseRoutes($routes, $prefix = '')
    {
         $collection = new RouteCollection;

        foreach ($routes as $path => $param) {

            // if $param is a string or callable,
            // we'll guess it' the controller
            if(is_string($param)) {

                if(strpos($param, '::') !== false) {
                    $param = ['controller' => $param ];
                } else {
                    $param = ['routes' => $param ];
                }
            }

            // @todo validate route

            //replace replaceable key
            $path = strtr($path, $this->replaces);

            // If no controller defined. we guess this is groups
            if (isset($param['routes'])) {

                // if routes is a string, we assume that is resources controller
                if(is_string($param['routes'])) {
                    
                    $reflClass = new \ReflectionClass($param['routes']);
                    
                    $methods = $reflClass->getMethods(\ReflectionMethod::IS_PUBLIC);

                    $methods = array_filter($methods, function($reflMethod) use($reflClass){ 
                        return $reflMethod->getDeclaringClass()->getName() == $reflClass->getName();
                    });

                    $param['routes'] = [];
                    foreach ($methods as $reflMethod) {


                        if($reflMethod->getName() == 'index') {
                            $pathx = '/';
                        } else {
                            $pathx = snake_case($reflMethod->getName(), '-');
                        }

                        $parameters = $reflMethod->getParameters();

                        foreach ($parameters as $reflParam) {
                            $pathx .= '/{'.$reflParam->getName().'}';
                        }

                        $routeOptions = $this->getRouteOptions($reflMethod);

                        $route = [
                            'controller' => $reflClass->getName().'::'.$reflMethod->getName()
                        ];
                        
                        if(!empty($routeOptions)) {
                            $route = array_merge($route, $routeOptions);
                        }

                        $param['routes'][$pathx] = $route;
                    }

                    // @todo implement this in all extensions
                    // @todo fixes restrictions, maybe use docblock
                }

                $subCollection = $this->createRouteCollection($path, $param);
                $collection->addCollection($subCollection);
            
            } else {
                $route = $this->createRoute($path, $param);

                $method = $route->getMethods();

                $name = isset($param['name']) ? $param['name'] : $this->createRouteName($path, $method, $prefix);
                $collection->add($name, $route);
            }
        }
        
        return $collection;
    }

    /**
     * Get route option from doc comments
     *
     * @param ReflectionMethod $method
     * @return array
     */
    public function getRouteOptions(\ReflectionMethod $method)
    {
        $doc = $method->getDocComment();

        $doc = trim($doc, '/*');
        $lines = array_filter(explode('*', $doc));

        $options = array();
        foreach ($lines as $line) {
            $line = trim($line);
            if(strpos($line, '@route_') == 0) {
                $tmp = explode(' ', $line);
                $key = substr(array_shift($tmp), strlen('@route_'));
                if(in_array($key, $this->routeOptionKeys)) {
                    $options[$key] = implode(' ', $tmp);
                }
            }
        }

        return $options;
    }

    public function getRoutes()
    {
        $this->routes = $this->parseRoutes($this->getRouteArray());

        return $this->routes;
    }

    /**
     * Get route collection.
     *
     * @return Symfony\Component\Routing\RouteCollection
     */
    public function getRouteArray()
    {
        return $this->routeArray;
    }

    /**
     * Add route deefinition
     *
     * @param string $name
     * @param array $definition
     */
    public function addRouteArray(array $array)
    {
        $this->routeArray = array_merge_recursive($this->routeArray, $array);
    }

    /**
     * add replaces route key definition
     *
     * @param array
     */
    public function addReplaces($key, $value = '')
    {
        if(is_array($key)) {
            foreach ($key as $k => $v) {
                $this->replaces[$k] = $v;
            }
        } else {
            $this->replaces[$key] = $value;
        }
    }

    public function getRoute($name)
    {
        if(!$this->routes) {
            $this->getRoutes();
        }

        return $this->routes->get($name);
    }

    public function setCacheDir($cacheDir)
    {
        $this->cacheDir = $cacheDir;
    }
}