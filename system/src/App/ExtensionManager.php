<?php namespace Drafterbit\App;

use Composer\Autoload\ClassLoader;
use Symfony\Component\Finder\Finder;

class ExtensionManager
{

    protected $app;
    protected $loaded;
    protected $loader;
    protected $enabled;
    protected $installed = [];
    protected $extensionsPath;
    protected $defaultNS = 'Drafterbit\\Extensions\\';

    /**
     * Extension manager constructor.
     *
     * @param  Drafterbit\Base\Application $app
     * @param  Composer\ClassLoader             $loader
     * @param  array                            $extensionsPath
     * @return void
     */
    public function __construct(Kernel $app, ClassLoader $loader, $extensionsPath = [])
    {
        $this->app = $app;
        $this->loader = $loader;
        $this->extensionsPath = $extensionsPath;
    }

    /**
     * Get installed extensions
     *
     * @return array
     */
    public function getInstalled()
    {
        if (count($this->installed) == 0) {
            foreach ($this->extensionsPath as $path) {
                $finder = $this->createFinder()->in($path)->directories()->depth(0);
                foreach ($finder as $file) {
                    $name = $file->getFileName();
                    if (in_array($name, $this->installed)) {
                        throw new \Exception("Extension name collision: $name");
                    }

                    $config = [];

                    if (file_exists($file.'/config.php')) {
                        $config = include $file.'/config.php';
                    }

                    $config['path'] = $path;
                    $this->installed[$name] = $config;
                }
            }
        }

        return $this->installed;
    }

    /**
     * Refresh installed in case we add new path
     *
     * @return vois
     */
    public function refreshInstalled()
    {
        $this->installed = [];
    }

    /**
     * Get Core Extension
     *
     * @return array
     */
    public function getCoreExtension()
    {
        return ['system', 'user','pages', 'files', 'blog'];
    }

    /**
     * Get Enabled Extension
     *
     * @return array
     */
    public function getEnabled()
    {
        return $this->enabled;
    }

    /**
     * Enabale an Extension
     *
     * @return mixed
     */
    public function enable($extension)
    {
        $this->get($extension)->enable();
        $this->enabled[$extension] = true;
    }

    /**
     * Get an Extension
     *
     * @return Drafterbit\Base\Extension
     */
    public function get($extension)
    {
        if (isset($this->loaded[$extension])) {
            return $this->loaded[$extension];
        }

        $installed = array_merge($this->getInstalled(),
            [
                'system' => [],
                'user' => [],
                'pages' => [],
                'files' => [],
            ]
        );

        if (!array_key_exists($extension, $installed)) {
            throw new \Exception("Extension $extension is not installed yet");
        }

        $config = $installed[$extension];


        if(!in_array($extension, ['system', 'user', 'pages', 'files'])) {
            $path = $config['path'];

            //register autoload
            $autoload = isset($config['autoload']) ?
                $config['autoload'] :
                $this->defaultAutoload($extension);

            $this->registerAutoload($autoload, $path.'/'.$extension);
        }


        $ns = isset($config['ns']) ? $config['ns'] : $this->defaultNS;
        $class = $ns.studly_case($extension).'\\'.studly_case($extension).'Extension';

        $instance = new $class;

        // register menu
        if (method_exists($instance, 'getNav')) {
            $this->app->addNav($instance->getNav());
        }

        // register permissions
        if (method_exists($instance, 'getPermissions')) {
            $this->app->addPermission($extension, $instance->getPermissions());
        }

        return $this->loaded[$extension] = $instance;
    }

    /**
     * @return Partitur\Framework\Extension
     */
    public function load($extension)
    {
        return $this->app->addExtension($this->get($extension));
    }

    /**
     * Extract config.php from extension directory
     *
     * @param string $extension modul name
     * @param string $path      extension path
     */
    private function extractConfig($extension, $path)
    {
        return include $path.'/config.php';
    }

    /**
     * Register autoload config to conposer autoloader
     *
     * @param  array  $config
     * @param  string $basepath
     * @return void
     */
    private function registerAutoload($config, $basePath)
    {
        foreach ($config as $key => $value) {
            switch($key) {
                case 'psr-4':
                    foreach ($value as $ns => $path) {
                        $this->loader->addPsr4($ns, $basePath.'/'.$path);
                    }
                    break;

                case 'psr-0':
                    foreach ($value as $ns => $path) {
                        $this->loader->addNamespace($ns, $basePath.'/'.$path);
                    }
                    break;

                case 'classmap':
                    $this->loader->addClassmap($value);
                    break;

                case 'files':
                    foreach ($value as $file) {
                        include $basePath.$extension.'/'.$file;
                    }
                    break;
            }
        }
    }

    /**
     * Create finder we can ues to find extensions
     *
     * @return Symfony\Component\Finder\Finder;
     */
    private function createFinder()
    {
        return new Finder;
    }

    private function defaultAutoload($extension, $ns = null)
    {
        $ns = !is_null($ns) ? $ns : $this->defaultNS.studly_case($extension).'\\';

        return [
            'psr-4' => [
                $ns => 'src'
            ]
        ];
    }

    public function addPath($path)
    {
        $this->extensionsPath = array_merge($this->extensionsPath, (array)$path);
    }
}
