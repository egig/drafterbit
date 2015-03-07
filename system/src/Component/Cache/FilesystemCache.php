<?php namespace Drafterbit\Component\Cache;

use Doctrine\Common\Cache\FilesystemCache as BaseDriver;

class FilesystemCache extends BaseDriver {

    const EXTENSION = '.drafteribit.cache.data';

    /** * {@inheritdoc} */
    protected $extension = self::EXTENSION;

    /**
     * @param string $id
     *
     * @return string
     */
    protected function getFilename($id)
    {
        if (FALSE === strpos(self::DOCTRINE_NAMESPACE_CACHEKEY, rtrim($id, '[]'))) {
            $dir = $this->removeNamespace($id);
            $path = $dir . DIRECTORY_SEPARATOR . $id . $this->extension;
        } else {
            $path = $id . $this->extension;
        }

        return $this->directory . DIRECTORY_SEPARATOR . $path;
    }

    /**
     * Remove namespace for scanable filesystem.
     *
     * @param string $id
     * @return string
     */
    private function removeNamespace($id)
    {
        $temp =  explode('][', $id);
        return ltrim(current($temp), '[');
    }
}