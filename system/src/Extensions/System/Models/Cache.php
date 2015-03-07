<?php namespace Drafterbit\Extensions\System\Models;

class Cache extends \Drafterbit\Base\Model
{

    public function getAll()
    {
        return array_merge(
            $this->getDataCache(),
            $this->getAssetCache(),
            $this->getRouteCache(),
            $this->getLanguageCache(),
            $this->getViewCache()
        );
    }

    private function getDataCache()
    {
        return [[
            'id' => 'Data',
            'size' => $this->getOnDirCacheSize($this['path.cache'])
        ]];
    }

    public function getAssetCache()
    {
         return [[
            'id' => 'Asset',
            'size' => $this->getOnDirCacheSize($this['path.content'].'cache/asset')
        ]];
    }

    public function getRouteCache()
    {
        $path = $this['path.content'].'cache/routes.php';

        if(is_file($path)) {        
            return [['id' => 'Routes', 'size' => $this->getCacheFileSize($path)]];
        }

        return  [];
    }

    public function getLanguageCache()
    {
        return [[
            'id' => 'Language',
            'size' => $this->getOnDirCacheSize($this['path.content'].'cache/l10n')
        ]];
    }

    public function getViewCache()
    {
        return [[
        'id' => 'View',
        'size' => $this->getOnDirCacheSize($this['path.content'].'cache/view')
        ]];
    }

    private function getCacheFileSize($file)
    {
        if(is_dir($file)) {
            $size = 0;
            $files = array_diff(scandir($file), ['.', '..']);        
            foreach ($files as $f) {
                $size += filesize($file.DIRECTORY_SEPARATOR.$f);
            }

        } else {
            $size = filesize($file);
        }

        return $size;
    }

    public function clear()
    {
        //routes
        $path = $this['path.content'].'cache/routes.php';
        $this['file']->remove($path);

        //others
        foreach ([
            $this['path.cache'],
            $this['path.content'].'cache/asset',
            $this['path.content'].'cache/l10n',
            $this['path.content'].'cache/view'
            ] as $dir) {
            $this->clearOnDirCaches($dir);
        }
    }

    private function getOnDirCacheSize($dir)
    {
        $size = 0;

        if (is_dir($dir)) {
            $finder = $this['finder'];
            $finder->in($dir)->files();

            foreach ($finder as $file) {
                $size += $this->getCacheFileSize($file->getRealPath());
            }
        }

        return $size;
    }

    private function clearOnDirCaches($dir)
    {
        if (is_dir($dir)) {
            $finder = $this['finder'];
            $finder->in($dir)->files();

            foreach ($finder as $file) {
                $this['file']->remove($file->getRealPath());
            }
        }
    }
}