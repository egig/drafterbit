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

class InstallationException extends \Exception {}

class Application extends Container implements HttpKernelInterface {
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
     * Application middlewares.
     *
     * @var array
     */
    protected $middlewares = [];

    /**
     * Content directory
     *
     * @var string
     */
    protected $contentDir;

    /**
     * Config File
     *
     * @var string
     */
    protected $configFile;

    /**
     * Application Constructor, build things.
     *
     * @param Composer\Autoload\ClassLoader
     */
    public function __construct($environment = 'development', $debug = true)
    {
        parent::__construct();
        
        $this['environment'] = $environment;
        $this['debug']       = $debug;
        $this['version']     = self::VERSION;
        
        $this['path']        = $this->getRoot();
        $this['path.config'] = $this->getResourcesPath('config');

        $this->register(new ExceptionServiceProvider);
        $this['exception']->register($this['environment']);
        $this['exception']->setDebug($this['debug']);

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

        ContainerTrait::setInstance($this['app'] = $this);
    }

    /**
     * Set content directory
     *
     * @param string $dir
     */
    public function setContentDir($dir)
    {
        $this->contentDir = $dir;
    }

    /**
     * Set config file
     *
     * @param string $file
     */
    public function setConfigFile($file)
    {
        $this->configFile = $file;
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

        $this->initKernel();
        $this->booted = true;
    }

    /**
     * Register single extension.
     *
     * @param string $extension
     */
    public function loadExtension($extension)
    {
        $extension = $this['extension']->get($extension);
        $name = $extension->getName();

        // boot
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

        // routes
        $routeArray = $this['config']['routes@'.$name];

        if($routeArray) {
            $this['router']->addRouteArray($routeArray);
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

    public function run()
    {
        try {
            $this->boot();
            $kernel = $this->initKernel();
            $response = $kernel->handle(request());

        } catch (\Exception $e) {
            $response = $this['exception']->handleException($e);
        }

        $this->prepareResponse($response)->send();
    }

    /**
     * Kernel initialization
     *
     * @param none
     * @return none
     */
    private function initKernel()
    {
        $stack = (new \Stack\Builder)
            ->push('Drafterbit\\Base\\Middlewares\\Session', $this['session'])
            ->push('Drafterbit\\Base\\Middlewares\\Router', $this)
            ->push('Drafterbit\\Base\\Middlewares\\Security', $this, $this['session'], $this['router'])
            ->push('Drafterbit\\Base\\Middlewares\\Log', $this);

        foreach ($this->middlewares as $middleware) {

            list($class, $parameters) = array_values($middleware);

            array_unshift($parameters, $class);

            call_user_func_array([$stack, 'push'], $parameters);
        }

        return $stack->resolve($this);
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
            return $this['exception']->handleException($e);
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

            if($extension = $this['extension']->get($name)) {

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

    /**
     * Load application system from database
     *
     * @return void
     */
    public function loadSystem()
    {
        $this->setupPaths();
        $this->loadConfig();

        try {
            $schema = $this['db']->getSchemaManager();
            
            if (!$schema->tablesExist('#_system')) {
                throw new InstallationException("No System Table", 2);
            }

            $this->loadExtension('system');

            $system = $this['extension']->get('system')->model('System')->all();

            date_default_timezone_set($system['timezone']);

            // configure theme
            $theme = $system['theme'];
            $this['themes']->current($theme);
            $this['path.theme'] = $this['path.themes'].$theme.'/';
            
            // language
            $this['translator']->setLocale($system['language']);

            if (is_dir($path = $this['path.theme'].'_l10n')) {
                $this['translator']->addPath($path);
            }

            // load the rest extension
            $extensions = isset($system['extensions']) ? json_decode($system['extensions'], true) : [];

            foreach ($extensions as $extension => $version) {
                $this->loadExtension($extension);
            }

            return $system;

        } catch (\PDOException $e) {
            if (in_array($e->getCode(), ['1045', '1044','1046', '1049'])) {
                die('cannot connect to database with provided setting');
            }

            throw $e;
        }
    }

    public function loadInstaller($code)
    {
        $sessionName = $this['config']['session']['session.name'];
        set_cookie($sessionName, null);

        $this['config']->set('key', 'dt_install');
        $this['session']->setName('dt_install_session');
        $this['router']->setCacheDir(false);
        
        $installer = $this->loadExtension('install');
        $installer->setStart($code);
    }

    private function setupPaths()
    {
        if(!$this->contentDir) {
            throw new \Exception("Please set content directory first");
        }

        $this['path.content']    = $this->contentDir.'/';
        $this['dir.content']     = basename($this['path.content']);
        $this['path.log']        = $this['path.content'].'cache/logs/';
        $this['path.cache']      = $this['path.content'].'cache/data/';
        $this['path.themes']     = $this['path.content'].'themes/';

        $this['asset']->setCachePath($this['path.content'].'cache/asset');
        $this['extension']->addPath($this['path.content'].'extensions');
        $this['translator']->addPath($this['path.content'].'l10n');
        
        if(!$this['debug']) {
            $this['translator']->setCachePath($this['path.content'].'cache/l10n');
        }
    }

    private function loadConfig()
    {
        $this['config_file'] = $this->configFile;

        if (!file_exists($this['config_file'])) {
            throw new InstallationException('No Config File', 1);
        }

        $this['config']->addReplaces('%content_dir%', $this['path.content']);

        foreach (require $this['config_file'] as $key => $value) {
            $this['config']->set($key, $value);
        }

        // override application debug
        $this['debug'] = $this['config']['debug'];
    }
}