<?php namespace Drafterbit\Base;

use Composer\Autoload\ClassLoader;
use Symfony\Component\Finder\Finder;

class ExtensionManager
{
    /**
     * Registered extensions.
     *
     * @var array
     */
    protected $extensions = [];

    /**
     * Extension loader, we'll use composer.
     *
     * @var Composer\Autoload\ClassLoader
     */
    protected $loader;

    /**
     * Extension Paths.
     *
     * @var array
     */
    protected $paths = [];

    /**
     * Default namespace for extensions.
     * Mainly used for built in extensions.
     *
     * @var string
     */
    protected $defaultNS = 'Drafterbit\\Extensions\\';

    /**
     * Data shared across extension.
     *
     * @var array
     */
    protected $data = [];

    /**
     * Loader extension config.
     *
     * @var array
     */
    protected $config = [];

    /**
     * Extension manager constructor.
     *
     * @param  Drafterbit\Base\Application $app
     * @param  Composer\ClassLoader $loader
     * @param  array $extensionsPath
     * @return void
     */
    public function __construct(ClassLoader $loader, $paths = [])
    {
        $this->loader = $loader;
        $this->paths = $paths;
    }

    /**
     * Data shared from extension.
     *
     * @return array
     */
    function data($section)
    {
        if(isset($this->data[$section])) {
            return $this->data[$section];
        }

        $method = 'get'.studly_case($section);

        $data = [];
        foreach ($this->extensions as $name => $instance) {
            if (method_exists($instance, $method)) {
                $data =  array_merge($data, $instance->$method());
            }
        }

        return $this->data[$section] = $data;
    }

    /**
     * Get installed extensions.
     *
     * @return array
     */
    public function getInstalled()
    {
        $installed = [];

        foreach ($this->paths as $path) {
            $finder = (new Finder)->in($path)->directories()->depth(0);
            foreach ($finder as $file) {
                $name = $file->getFileName();
                if (in_array($name, $installed)) {
                    throw new \Exception("Extension name collision: $name");
                }

                $config = [];

                if (file_exists($file.'/config.php')) {
                    $config = include $file.'/config.php';
                }

                $config['path'] = $path;
                $installed[$name] = $config;
            }
        }

        return $installed;
    }

    /**
     * Get an Extension.
     *
     * @return Drafterbit\Base\Extension
     */
    public function get($extension)
    {
        if (!isset($this->extensions[$extension])) {

            $this->registerAutoload($extension);

            $class = $this->getExtensionClass($extension);

            $instance = new $class;

            return $this->register($instance);
        }

        return $this->extensions[$extension];
    }

    /**
     * Get all extension'
     *
     * @return array
     */
    public function all()
    {
        return $this->extensions;
    }

    /**
     * Register an extension by its name;
     *
     * @param object
     */
    protected function register(Extension $extension)
    {
        return $this->extensions[$extension->getName()] = $extension;
    }

    /**
     * Get extension class
     *
     * @param string $extension
     * @return string
     */
    public function getExtensionClass($extension)
    {
        $config = $this->getConfig($extension);

        $ns = isset($config['ns']) ? $config['ns'] : $this->defaultNS;
        $class = $ns.studly_case($extension).'\\'.studly_case($extension).'Extension';

        return $class;
    }

    /**
     * Get extension config
     *
     * @param string
     * @return array
     */
    public function getConfig($extension)
    {
        if(isset($this->config[$extension])) {
            return $this->config[$extension];
        }

        $installed = $this->getInstalled();

        if (!array_key_exists($extension, $installed)) {
            throw new \Exception("Extension $extension is not installed yet");
        }

        return $this->config[$extension] = $installed[$extension];
    }

    /**
     * Register autoload config to composer autoloader
     *
     * @param  string $extension
     * @return void
     */
    private function registerAutoload($extension)
    {
        $config = $this->getConfig($extension);

        $autoload = isset($config['autoload']) ?
            $config['autoload'] :
            $this->defaultAutoload($extension);

        $basePath = $config['path'].'/'.$extension;

        foreach ($autoload as $key => $value) {
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
     * Get default autoload config.
     *
     * @return array
     */
    private function defaultAutoload($extension, $ns = null)
    {
        $ns = !is_null($ns) ? $ns : $this->defaultNS.studly_case($extension).'\\';

        return [
            'psr-4' => [
                $ns => 'src'
            ]
        ];
    }

    /**
     * Add extension path.
     *
     * @param string|array
     */
    public function addPath($path)
    {
        $this->paths = array_merge($this->paths, (array)$path);
    }
}
