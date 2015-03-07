<?php namespace Drafterbit\Component\Config\Loader;

interface LoaderInterface {
    
    /**
     * Load desired config file.
     *
     * @param string $path
     * @return array
     */
    public function load($path);

    /**
     * Get File Extension
     *
     * @return string
     */
    public function getFileExtension();
}