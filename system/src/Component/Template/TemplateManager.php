<?php namespace Drafterbit\Component\Template;

use Drafterbit\Component\Template\AssetManager;
use Assetic\Filter\CssMinFilter;
use Assetic\Filter\JSMinFilter;

class TemplateManager {

    /**
     * Data to display.
     *
     * @var array
     */
    protected $data = [];

    /**
     * Template paths to look for.
     *
     * @var array
     */
    protected $paths = [];

    /**
     * Cached variables.
     *
     * @var array
     */
    protected $cachedVars = [];

    /**
     * Template Parents;
     *
     * @var array
     */
    protected $globals = [];

    /**
     * Template Parents;
     *
     * @var array
     */
    protected $parents = [];

    /**
     * Current template
     *
     * @var string
     */
    protected $current;

    /**
     * Blocks
     *
     * @var array
     */
    protected $blocks = [];


    /**
     * Opened Blocks;
     *
     * @var array
     */
    protected $openBlocks = [];

    /**
     * the asset manager;
     *
     * @var Drafterbit\Component\Template\Asset\AssetManager;
     */
    protected $assetManager;

    /**
     * Assets.
     *
     * @var array
     */
    protected $assets = [];

    /**
     * Dumped assets;
     *
     * @var string
     */
    protected $assetsAdded = [];

    /**
     * Url prefix for the asset;
     *
     * @var string
     */
    protected $urlPrefix;

    /**
     * Constructor.
     *
     * @param string $path
     */
    public function __construct($path = null, EscaperIntarface $escaper = null, AssetManager $assetManager = null, $urlPrefix = '')
    {
        $this->paths['default'] = $path;
        $this->escaper = is_null($escaper) ? new Escaper() : $escaper;

        if(!is_null($assetManager)) {
            $this->assetManager = $assetManager;
            $this->urlPrefix = rtrim($urlPrefix,'/').'/';
        }
    }

    /**
     * Load Template File.
     *
     * @param string $path
     * @param array | object $data 
     */
    public function render($path, $data = [])
    {
        $data = array_replace($this->getGlobals(), $data);

        $templatePath = $this->getDefaultPath();

        if( $path[0] == '@') {
            $temp = explode('/', $path);
            $pathAlias = ltrim(array_shift($temp), '@');
            $path = implode('/', $temp);
         
            $templatePath = $this->getPath($pathAlias);
        }

        $templatePath = rtrim($templatePath, '/').'/';

        $fileExt = pathinfo($path, PATHINFO_EXTENSION);
        
        $templateFile = ($fileExt == '') ? $path.'.php' : $path;


        if ( ! file_exists($path = $templatePath.$templateFile)) {
            throw new Exceptions\TemplateNotFoundException("Template file $path not found.", 1);
        }

        $this->current = $path;
        $this->parents[$this->current] = null;

        //Extract and cache variables
        $data = $this->objectToArray(array_merge($this->data, $data));
        
        if (is_array($data)) {
            $this->cachedVars = array_merge($this->cachedVars, $data);
        }
        
        $content = $this->doRender($path, $this->cachedVars);

        if($this->parents[$this->current]) {
            $this->blocks['content'] = $content;

            return $this->render($this->parents[$this->current], $data);
        }

        return $content;
    }

    /**
     * Do render.
     *
     * @param string $path
     * @param array $data
     * @return string
     */
    public function doRender($path, $data = [])
    {
        extract($data);

        ob_start();

        include($path);

        $buffer = ob_get_contents();

        @ob_end_clean();

        return $buffer;
    }

    /**
     * Object to Array
     *
     * @param object $data
     * @return  array
     */
    protected function objectToArray($data)
    {
        return (is_object($data)) ? get_object_vars($data) : $data;
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

    /**
     * Get all Template Path.
     *
     * @return array
     */
    public function getPaths()
    {
        return $this->paths;
    }

    /**
     * Get named template Path.
     *
     * @return array
     */
    public function getPath( $name )
    {
        if( ! isset($this->paths[ $name ]) )
        {
            throw new \RuntimeException("Unknown template path alias '$name'");
        }

        return $this->paths[ $name ];
    }

    /**
     * Get data
     *
     * @return mixed
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * Set data
     *
     * @return mixed
     */
    public function setData( array $data)
    {
        return $this->data = array_merge($this->data, $data);
    }

    /**
     * Set single data.
     *
     * @param string $key
     * @param mixed $value
     */
    public function set($key,$value)
    {
        $this->data[$key] = $value;

        return $this;
    }

    /**
     * Register template parents
     */
    public function extend($name)
    {
        $this->parents[$this->current] = $name;
    }

    /**
     * Start a block
     */
    public function start($name)
    {
        if (in_array($name, $this->openBlocks)) {
            throw new \InvalidArgumentException(sprintf('A block named "%s" is already started.', $name));
        }

        $this->openBlocks[] = $name;
        $this->blocks[$name] = '';

        if($this->parents[$this->current]) {        
            ob_start();
            ob_implicit_flush(0);
        }
    }

    /**
     * Ends a block.
     *
     * @throws \LogicException if no clock has been started
     *
     * @api
     */
    public function end()
    {
        if (!$this->openBlocks) {
            throw new \LogicException('No block started.');
        }

        if($this->parents[$this->current]) {
            $name = array_pop($this->openBlocks);
            $this->blocks[$name] = ob_get_clean();
        }
    }

    /**
     * return a block
     */
    public function block($name, $default = false)
    {
        if(in_array($name, ['js', 'css'])) {
            $this->handleAsset($name);
        }

        return isset($this->blocks[$name]) ? $this->blocks[$name] : $default;
    }

    /**
     * escaping
     */
    public function escape($value, $context = 'html')
    {
        return $this->escaper->escape($value, $context);
    }


    /**
     * @param string $name
     * @param mixed  $value
     *
     * @api
     */
    public function addGlobal($name, $value)
    {
        $this->globals[$name] = $value;

        return $this;
    }

    /**
     * Returns the assigned globals.
     *
     * @return array
     *
     * @api
     */
    public function getGlobals()
    {
        return $this->globals;
    }

    /**
     * Handle asset, create js and css block
     *
     */
    private function handleAsset($type)
    {
        foreach ($this->assets[$type] as $asset) {
            if(!in_array($asset['input'], $this->assetsAdded)) {
                $this->getAssetManager()->add($type, explode(',', $asset['input']), $asset['filter']);
                $this->assetsAdded[] = $asset['input'];
            }
        }

        if(!isset($this->blocks[$type])) {
            $this->blocks[$type] = '';
        }

        $this->assets[$type] = [];

        $debug = $this->assetManager->getDebug();

        switch ($type) {
            case 'js':
                $jsFileName = $this->urlPrefix.$this->getAssetManager()->dumpToFile('js', new JSMinFilter);
                $src = $debug ? $jsFileName.'?_'.time() : $jsFileName;
                $this->blocks['js'] .= sprintf('<script src="%s" type="text/javascript"></script>', $src);
                break;
            case 'css':
                $cssFileName = $this->urlPrefix.$this->getAssetManager()->dumpToFile('css', new CSSMinFilter);
                $src = $debug ? $cssFileName.'?_'.time() : $cssFileName;
                $this->blocks['css'] .= sprintf('<link href="%s" type="text/css" rel="stylesheet"/>', $src);
                break;
            default:
                break;
        }
    }

    public function css($input, $filter = [])
    {
        $this->addAsset('css', $input, $filter);
    }

    public function js($input, $filter = [])
    {
        $this->addAsset('js', $input, $filter);
    }

    /**
     * add new asset
     */
    public function addAsset($type, $input, $filter = [])
    {
        isset($this->assets[$type]) or $this->assets[$type] = [];


        foreach (array_reverse(explode(',', $input)) as $input) {
            
            // because we will typically add asset from child template first
            // we'll add new asset to the top of asset stack

            $newAsset = ['input' => $input, 'filter' => $filter];
            array_unshift($this->assets[$type], $newAsset);
        }
    }

    public function getAssetManager()
    {
        if(!$this->assetManager) {
            $thisClass = get_class($this);
            throw new \Exception("No asset manager set for $thisClass");
        }

        return $this->assetManager;
    }

    public function setAssetManager(AssetManager $assetManager)
    {
        $this->assetManager = $assetManager;
    }
}