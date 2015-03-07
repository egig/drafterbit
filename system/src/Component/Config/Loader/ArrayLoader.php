<?php namespace Drafterbit\Component\Config\Loader;

class ArrayLoader implements LoaderInterface {
    
    /**
     * Load desired config file.
     *
     * @param string $path
     * @return array
     */
    public function load($path) {
        return require $path;
    }

    /**
     * Get File Extension
     *
     * @return string
     */
    public function getFileExtension() {
        return '.php';
    }
}