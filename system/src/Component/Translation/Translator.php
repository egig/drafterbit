<?php namespace Drafterbit\Component\Translation;

use Symfony\Component\Finder\Finder;
use Symfony\Component\Translation\Translator as BaseTranslator ;

class Translator extends BaseTranslator {

    /**
     * Registered locales
     *
     * @var array
     */
    protected $locales = ['en_EN'];

    /**
     * Registered Path to load catalogue from
     *
     * @var array
     */
    protected $paths = [];

    /**
     * Registered Path to load catalogue from
     *
     * @var array
     */
    protected $cachePath;

    /**
     * add Path
     *
     * @param string $locale
     */
    public function addPath($path)
    {
        $this->paths[] = $path;

        $locales = array_diff(scandir($path), ['.','..']);

        foreach ($locales as $locale) {
            $this->assertValidLocale($locale);

            in_array($locale, $this->locales) or
                array_push($this->locales, $locale);
        }
    }

    /**
     * Create Finder
     *
     * @return Symfony\Component\Finder\Finder
     */
    public function createFinder()
    {
        return new Finder;
    }

    /**
     * Dump current langage catalogue as json
     * useful for js translation
     *
     * @return string
     */
    public function asJson($domain = 'messages') {

        $this->assertValidLocale($locale = $this->getLocale());

        if (!isset($this->catalogues[$locale])) {
            $this->loadCatalogue($locale);
        }

        return json_encode($this->catalogues[$locale]->all($domain));
    }

    /**
     * Get registered locales
     *
     * @return array
     */
    public function getLocales()
    {
        return $this->locales;
    }

    /**
     * {@inheritdoc}
     */
    protected function loadCatalogue($locale)
    {
        if($this->cachePath) {
            $cacheFileName = $locale.'.cache';
            if(is_file($file = $this->cachePath.'/'.$cacheFileName)) {

                $this->loadCachedResources($locale);
                return parent::loadCatalogue($locale);
            } else {
                $this->loadResources($locale);
                parent::loadCatalogue($locale);

                $catalogue = $this->catalogues[$locale]->all('messages');
                return $this->write($file, serialize($catalogue));
            }
        }

        $this->loadResources($locale);
        parent::loadCatalogue($locale);
    }

    /**
     * Write content to a file.
     *
     * @param $path
     * @param string $content
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

    private function loadCachedResources($locale)
    {
        $cacheFileName = $locale.'.cache';
        $res = unserialize(file_get_contents($this->cachePath.'/'.$cacheFileName));
        $this->addResource('array', $res, $locale);
    }

    private function loadResources($locale)
    {
        foreach ($this->paths as $path) {

            if(!is_dir($path .= '/'.$locale)) continue;

            $files = $this->createFinder()->in($path)->files();

            foreach ($files as $file) {

                switch($file->getExtension()) {
                    case 'php':
                        $this->addResource('array', require $file, $locale);
                        break;
                    case 'json':
                        $this->addResource('json', $file->getRealPath(), $locale);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    public function setCachePath($cachePath)
    {
        $this->cachePath = $cachePath;
    }
}