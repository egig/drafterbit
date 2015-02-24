<?php namespace Drafterbit\System;

class ThemeManager
{
    protected $themes;
    protected $current;
    protected $path;

    /**
     * Constructor
     *
     * @param array $path
     */
    public function __construct($path = [])
    {
        $this->path = $path;
    }

    /**
     * Get or set current theme.
     *
     * @param string $thame theme name
     */
    public function current($theme = null)
    {
        if (is_null($theme)) {
            return $this->current;
        }

        return $this->current = $theme;
    }

    /**
     * Get all installed themes.
     *
     * @return array
     */
    public function all()
    {
        if($this->themes) {
            return $this->themes;
        }

        foreach ($this->path as $path) {
            $themes = new \FilesystemIterator($path);
            
            foreach ($themes as $theme) {
                if($theme->isDir()
                    and is_file($file = $theme->getRealpath().'/theme.json')) {
                    $config = json_decode(file_get_contents($file), true);
                    $this->themes[$theme->getFilename()] = $config;
                }
            }
        }

        return $this->themes;
    }

    /**
     * Get a theme config.
     *
     * @param  string $name
     * @return array
     */
    public function get($theme = null)
    {
        $this->themes = $this->all();
        $theme = is_null($theme) ? $this->current : $theme;

        return isset($this->themes[$theme]) ? $this->themes[$theme] : false;
    }
}