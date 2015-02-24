<?php namespace Drafterbit\System;

use Monolog\Logger;
use Drafterbit\Framework\Application;
use Drafterbit\System\Log\DoctrineDBALHandler;
use Drafterbit\System\Provider\WidgetServiceProvider;
use Drafterbit\System\Provider\ExtensionServiceProvider;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

abstract class Kernel extends Application
{
    /**
     * Application admin navigation.
     *
     * @var array
     */
    protected $nav = [];

    /**
     * Permissions.
     *
     * @var array
     */
    protected $permissions = [];

    /**
     * Log Entity Labels.
     *
     * @var array
     */
    protected $logEntityLabels = [];
    
    /**
     * Application Fronpage options.
     *
     * @var array
     */
    protected $frontpage = [];

    public function __construct($environment = 'development', $debug = true)
    {
        parent::__construct($environment, $debug);

        $this['version'] = self::VERSION;

        $this->register(new ExtensionServiceProvider);
        $this->register(new WidgetServiceProvider);

        foreach (include $this->getResourcesPath('config/services.php')
            as $provider => $services) {
            $this->addDeferred($provider, $services);
        }
    }

    public function addNav($nav)
    {
        $this->nav = array_merge($this->nav, $nav);
    }

    public function getNav()
    {
        return $this->nav;
    }

    public function addPermission($extension, $permissions)
    {
        if (!isset($this->permissions[$extension])) {
            $this->permissions[$extension] = $permissions;
        } else {
            $this->permissions[$extension] = array_merge($this->permissions[$extension], $permissions);
        }
    }

    public function getPermissions()
    {
        return $this->permissions;
    }


    public function loadsystem()
    {
        try {
            $schema = $this['db']->getSchemaManager();
            
            if (!$schema->tablesExist('#_system')) {
                throw new InstallationException("No System Table", 2);
            }

            $this['extension.manager']->load('system');
            return $this->getExtension('system')->model('System')->all();

        } catch (\PDOException $e) {
            if (in_array($e->getCode(), ['1045', '1044','1046', '1049'])) {
                die('bad config :(');
            }

            throw $e;
        }
    }

    public function configure($configFile)
    {
        if (!file_exists($configFile)) {
            throw new InstallationException('No Config File', 1);
        }

        $config = $this['config']->load($configFile);

        $this['router']->addReplaces('%admin%', $config['path.admin']);

        $this['path.cache'] =  $this['path.content'].'cache/data';

        foreach ([
            'chosen_css' => 'Drafterbit\\System\\Asset\Filter\\ChosenFilter',
            'fontawesome' => 'Drafterbit\\System\\Asset\Filter\\FontAwesomeFilter',
            'colorpicker_css' => 'Drafterbit\\System\\Asset\Filter\\ColorPickerFilter'
            ]
            as $name => $class) {
                $this['asset']->getFilterManager()->set($name, new $class($this['dir.system'].'/vendor/web'));
        }

        $system = $this->loadsystem();

        //language
        $this['translator']->setLocale($system['language']);
        $this['translator']->addPath($this['path.content'].'l10n');
        if(!$this['debug']) {
            $this['translator']->setCachePath($this['path.content'].'cache/l10n');
        }

        if(!$this['debug']) {
            $this['translator']->setCachePath($this['path.content'].'/cache/l10n');
        }

        //theme
        $theme = $system['theme'];

        $this['path.themes'] = $this['path.content'].'themes/';
        
        $this['themes']->current($theme);
        
        // add language catalogue
        if (is_dir($path = $this['path.themes'].$this['themes']->current().'/l10n')) {
            $this['translator']->addPath($path);
        }

        $this['path.theme'] = $this['path.themes'].$this['themes']->current().'/';

        $extensions = [];
        if ($system !== false) {
            $extensions = json_decode($system['extensions'], true);
        }

        foreach ($extensions as $extension => $version) {
            $this['extension.manager']->load($extension);
        }

        date_default_timezone_set($system['timezone']);

        if (! $this['debug']) {
            $this['exception']->error(
                function(NotFoundHttpException $e){
                
                    if (is_file($this['path.theme'].'404.html')) {
                        $this['twig']->setLoader(new \Twig_Loader_Filesystem($this['path.theme']));
                        return $this['twig']->render('404.html');
                    }

                    return file_get_contents($this->getResourcesPath('views/404.html'));
                }
            );
        }

        $this['log.db'] = function(){
            $logger =  new Logger('db.log');
            $logger->pushHandler(new DoctrineDBALHandler($this['db']));
            return $logger;
        };

        $this['log.db']->pushProcessor(
            function ($record) {
                $record['formatted'] = "%message%";
                return $record;
            }
        );

        // base url
        $this['dispatcher']->addListener(
            'boot',
            function(){

                // frontpage
                $frontpage = $this->getFrontpage();
                $system = $this->getExtension('system')->model('@system\System')->all();
                $homepage = $system['homepage'];
                $route = $frontpage[$homepage];

                $this['router']->addRouteDefinition(
                    '/',
                    [
                    'controller' => $route['controller'],
                    'defaults' => $route['defaults']
                    ]
                );

                // pages
                $reservedBaseUrl = implode('|', $this->getReservedBaseUrl());
                $this['router']->addRouteDefinition(
                    '/{slug}',
                    [
                    'controller' => '@pages\Frontend::view',
                    'requirements' => [
                    // @prototype  'slug' => "^(?!(?:backend|blog)(?:/|$)).*$"
                    'slug' => "^(?!(?:%admin%|".$reservedBaseUrl."|)(?:/|$)).*$"
                    ]
                    ]
                );
            },
            -512
        );

        $this->addMiddleware('Drafterbit\\System\\Middlewares\\Security', [$this, $this['session'], $this['router']]);
        $this->addMiddleware('Drafterbit\\System\\Middlewares\\Log', [$this]);
    }

    public function getFrontpage()
    {
        $qb = $this['db']->createQueryBuilder();

        $pages = $qb->select('*')
            ->from('#_pages', 'p')
            ->execute()->fetchAll();

        $options = [];
        foreach ($pages as $page) {
            $options['pages:'.$page['id']] = [
                'label' => $page['title'],
                'controller' => '@pages\Frontend::home',
                'defaults' => ['id' => $page['id'], 'slug' => $page['slug']]
            ];
        }

        return array_merge($this->frontpage, $options);
    }

    public function addFrontPageOption($array)
    {
        $this->frontpage = array_merge($this->frontpage, $array);
    }

    public function getFrontPageOption()
    {
        $options = [];

        foreach ($this->getFrontpage() as $id => $param) {
            $options[$id] = $param['label'];
        }

        return $options;
    }

    public function getReservedBaseUrl()
    {
        $urls = [];
        foreach ($this->getExtensions() as $extension) {
            if (method_exists($extension, 'getReservedBaseUrl')) {
                $urls =  array_merge($urls, $extension->getReservedBaseUrl());
            }
        }

        return $urls;
    }

    public function setContentDir($dir)
    {
        $this['path.content'] = realpath($dir).'/';
        $this['config']->addReplaces('%content_dir%', $dir);
    }

    public function setConfigFile($file)
    {
        $this['config_file'] = $file;
    }

    public function run()
    {
        $this['dir.content']     = basename($this['path.content']);
        $this['dir.system']      = basename($this['path']);
        $this['path.extensions'] = $this['path.content'] . '/extensions';
        $this['path.install']    = $this['path.public'] =  getcwd().'/';
        $this['path.log']        = $this['path.content'].'cache/logs';

        // asset
        $this['config']->addReplaces('%path.vendor.asset%', $this['path'].'vendor/web');
        $this['config']->addReplaces('%path.system.asset%', $this['path'].'Resources/public/assets');

        $config = $this['config']['app'];
        $this['debug'] = $config['debug'];

        $this['exception']->setDebug($this['debug']);

        if ($config['error.log']) {
            $this['exception']
                ->error(
                    function(\Exception $exception, $code) {
                        $this['log']->addError($exception);
                    }
                );
        }

        $this['asset']->setCachePath($this['path.content'].'cache/asset');

        foreach ($this['config']->get('asset.assets') as $name => $value) {
            $this['asset']->register($name, $value);
        }

        try {
            $this->configure($this['config_file']);

        } catch (InstallationException $e) {

            $code = $e->getCode();
            

            $this['extension.manager']->load('install');
            
            $this->getExtension('install')->setStart($code);

            $sessionName = $this['config']['session']['session.name'];
            set_cookie($sessionName, null);
            
            $this['config']->set('key', 'dt_install');
            $this['session']->setName('dt_install_session');

            $this['router']->setCacheDir(false);
        }

        parent::run();
    }

    function getLogEntityLabel($entity, $id)
    {
        return call_user_func_array($this->logEntityLabels[$entity], [$id]);
    }

    function addLogEntityFormatter($entity, $callback)
    {
        $this->logEntityLabels[$entity] = $callback;
    }

    function dashboardWidgets()
    {
        $widgets = [];
        
        foreach ($this->getExtensions() as $extension) {
            if (method_exists($extension, 'dashboardWidgets')) {
                $widgets =  array_merge($widgets, $extension->dashboardWidgets());
            }
        }

        return $widgets;
    }

    function getStat()
    {
        $stat = [];
        
        foreach ($this->getExtensions() as $extension) {
            if (method_exists($extension, 'getStat')) {
                $stat =  array_merge($stat, $extension->getStat());
            }
        }

        return $stat;
    }

    function getShortcuts()
    {
        $shortcuts = [];
        
        foreach ($this->getExtensions() as $extension) {
            if (method_exists($extension, 'getShortcuts')) {
                $shortcuts =  array_merge($shortcuts, $extension->getShortcuts());
            }
        }

        return $shortcuts;
    }
}