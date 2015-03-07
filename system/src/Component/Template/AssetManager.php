<?php namespace Drafterbit\Component\Template;

use Assetic\AssetManager as BaseManager;
use Assetic\FilterManager;
use Assetic\Filter\FilterInterface;
use Assetic\Asset\AssetInterface;
use Assetic\Asset\AssetCollection;
use Assetic\Asset\AssetReference;
use Assetic\Asset\HttpAsset;
use Assetic\Asset\GlobAsset;
use Assetic\Asset\FileAsset;

class AssetManager extends BaseManager {

    protected $assets = [];
    protected $debug;
    protected $name = [];
    protected $paths = [];
    protected $cachePath;
    protected $collections = [];
    protected $input = [];
    protected $filterManager;

    /**
     * Constructor.
     *
     * @return void
     */
    public function __construct($cachePath = null, $debug = true, $defaultPath = null)
    {
        $this->cachePath = rtrim($cachePath,'/');
        $this->debug = $debug;
        $this->filterManager = new FilterManager();

        if(!is_null($defaultPath)) {
            $this->paths['default'] = $defaultPath;
        }
    }

    /**
     * Write content to a file.
     *
     * @param $path
     */
    public function write($path, $content)
    {
        if (!is_dir($dir = dirname($path)) && false === @mkdir($dir, 0777, true)) {
            throw new \RuntimeException('Unable to create directory '.$dir);
        }

        if (false === file_put_contents($path, $content)) {
            throw new \RuntimeException('Unable to write file '.$path);
        }
    }

    /**
     * Register an asset from given string
     *
     * @param string $name
     * @param mixed  $asset
     * @param array  $filter
     *
     * @throws \InvalidArgumentException If the asset name is invalid
     */
    public function register($name, $asset, $filter = [], $options = [])
    {
        $asset = $this->parseInput($asset, $filter);
        return $this->set($name, $asset);
    }

    /**
     * Get Filter Manager.
     *
     * @return Drafterbit\Component\Template\Asset\Filter\FilterManager
     */
    public function getFilterManager()
    {
        return $this->filterManager;
    }

    /**
     * Create an asset collection
     *
     * @return Drafterbit\Component\Template\Asset\AssetCollection
     */
    public function create($type)
    {
        $this->collections[$type] = new AssetCollection;

        return $this;
    }

    /**
     * Add an asset to collection for fump.
     *
     * @param string $type
     */
    public function add($type, $name, $filter = [])
    {

        if(is_array($name)) {
            foreach ($name as $nm) {
                $this->add($type, $nm, $filter);
            }

        } else {

            $this->input[$type][] = [
                'name' => $name,
                'filter' => $filter
            ];
        }
        
        return $this;
    }

    /**
     * Dump asset
     *
     * @return string
     */
    public function dump($type, FilterInterface $lastFilter = null)
    {
        if(!isset($this->collections[$type])) {
            $this->create($type);
        }

        foreach ($this->input[$type] as $input) {

            $asset = $this->parseInput($input['name'], $input['filter']);
            $this->collections[$type]->add($asset);
        }

        return $this->collections[$type]->dump($lastFilter);
    }

    /**
     * Dump to file;
     *
     * @param string $type
     * @param Assetic\Filter\FilterInterface $lastFilter
     * @return string
     */
    public function dumpToFile($type, FilterInterface $lastFilter = null)
    {
        if(is_null($this->cachePath)) {
            throw new \Exception("Asset cache path is not been set yet.
                You need to use setCachePath() once before use dumpToFile()");
        }

        $fileName = isset($this->name[$type]) ?
            $this->name[$type] : $this->createFileName($this->input[$type]);

            $dest = $this->cachePath."/$type/".$fileName.".$type";

        if($this->debug) {
            $this->write($dest, $this->dump($type));
        } else {
            file_exists($dest) or $this->write($dest, $this->dump($type, $lastFilter));
        }

        return "$type/".$fileName.".$type";
    }

    /**
     * Create File name.
     *
     * @return string
     */
    public function createFileName($asset)
    {
        return sha1(serialize($asset));
    }

    /**
     * Get cache path.
     *
     * @return string
     */
    public function getCachePath()
    {
        return $this->cachePath;
    }

    /**
     * Set cache path.
     *
     * @param string $path
     */
    public function setCachePath($path)
    {
        return $this->cachePath = $path;
    }

    /**
     * Parse asset defined in config on-fly addition.
     *
     * @param mixed
     * @param array $options
     * @return Drafterbit\Component\Template\Asset\AssetInterface;
     */
    public function parseInput($input, $filter = [])
    {
        $input = trim($input);

        if (false !== strpos($input, '://') || 0 === strpos($input, '//')) {
            $asset =  $this->createHttpAsset($input);
        
        } else if (':' == $input[0]) {
            $asset =  $this->createAssetReference(substr($input, 1));

        } else {

            $path = $this->getDefaultPath();
            
            if( '@' == $input[0]) {

                $temp = explode('/', $input);
                $pathAlias = ltrim(array_shift($temp), '@');
                $input = implode('/', $temp);
             
                $path = $this->getPath($pathAlias);
            }

            $path = rtrim($path, '/').'/';

            if (false !== strpos($input, '*')) {
                $asset = $this->createGlobAsset($path.$input);
            } else {
                $asset =  $this->createFileAsset($path.$input);
            }
        }
        
        $filters = $this->parseInputFilter($filter);

        foreach ($filters as $filter) {
            if ($filter instanceof FilterInterface) {
                $asset->ensureFilter($filter);
            }
        }

        return $asset;
    }

    /**
     * Parse input  filter.
     *
     * @param string $filter
     * @return mixed
     */
    protected function parseInputFilter($filter)
    {
        $filters = (array) $filter;

        foreach ($filters as &$f) {
            if ( isset($f[0]) and ':' == $f[0]) {
                $f = $this->filterManager->get(substr($f, 1));
            }
        }

        return $filters;
    }

    protected function createAssetReference($name)
    {
        return new AssetReference($this, $name);
    }

    protected function createHttpAsset($sourceUrl)
    {
        return new HttpAsset($sourceUrl);
    }

    protected function createGlobAsset($glob)
    {
        return new GlobAsset($glob);
    }

    protected function createFileAsset($source, $root = null, $path = null, $vars = [])
    {
        // we'll use ensure filter to add filter to the asset.
        return new FileAsset($source, []);
    }

    /**
     * Gets an asset by name.
     *
     * @param string $name The asset name
     *
     * @return AssetInterface The asset
     *
     * @throws \InvalidArgumentException If there is no asset by that name
     */
    public function get($name)
    {
        if (!isset($this->assets[$name])) {
            throw new \InvalidArgumentException(sprintf('There is no "%s" asset.', $name));
        }

        return $this->assets[$name];
    }

    /**
     * Checks if the current asset manager has a certain asset.
     *
     * @param string $name an asset name
     *
     * @return Boolean True if the asset has been set, false if not
     */
    public function has($name)
    {
        return isset($this->assets[$name]);
    }

    /**
     * Set name
     */
    public function setName($type, $name)
    {
        $this->name[$type] = $name;
    }

    /**
     * Registers an asset to the current asset manager.
     *
     * @param string         $name  The asset name
     * @param AssetInterface $asset The asset
     *
     * @throws \InvalidArgumentException If the asset name is invalid
     */
    public function set($name, AssetInterface $asset)
    {
        $this->assets[$name] = $asset;
    }

    /**
     * Returns an array of asset names.
     *
     * @return array An array of asset names
     */
    public function getNames()
    {
        return array_keys($this->assets);
    }

    /**
     * Clears all assets.
     */
    public function clear()
    {
        $this->assets = [];
    }

    /**
     * Add js asset
     *
     * @param string $name
     */
    public function js($name, $filter = [], $options = [])
    {
        return $this->add('js', $name, $filter, $options);
    }

    /**
     * Add css asset
     *
     * @param string $name
     */
    public function css($name, $filter = [], $options = [])
    {
        return $this->add('css', $name, $filter, $options);
    }

    /**
     * Asset file name.
     *
     * @param string
     */
    public function setJsName($name)
    {
        $this->setName('js', $name);
    }

    /**
     * Asset file name.
     *
     * @param string
     */
    public function setCSSName($name)
    {
        $this->setName('css', $name);
    }

    /**
     * Get Default Path
     *
     * @return string 
     */
    public function getDefaultPath()
    {
        return isset($this->paths['default'])  ? $this->paths['default'] : false;
    }

    /**
     * Get package Path.
     *
     * @return array
     */
    public function getPath( $name )
    {
        if( ! isset($this->paths[ $name ]) ) {
            throw new \RuntimeException("Unknown asset path alias '$name'");
        }

        return $this->paths[ $name ];
    }

    /**
     * Add template path.
     *
     * @param string $alias
     * @param string $path
     */
    public function addPath($alias, $path)
    {
        $this->paths[$alias] = $path;

        return $this;
    }

    public function getDebug()
    {
        return $this->debug;
    }
}