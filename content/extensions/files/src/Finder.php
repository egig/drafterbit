<?php namespace Drafterbit\Extensions\Files;

use Gregwar\Image\Image;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder as SymfonyFinder;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;

class Finder {
    
    /**
     * Root of filesystem to browse;
     *
     * @var string
     */
    protected $root;

    /**
     *
     * Symfony Filesystem Component
     *
     * @var Symfony\Component\Filesystem\Filesystem
     */
    protected $fileSystem;

    /**
     * The Constructor.
     *
     * @param string $root
     * @param string Symfony\Component\Filesystem\Filesystem $fileSystem
     */
    public function __construct($root, Filesystem $fileSystem = null)
    {
        $this->root = realpath($root);
        $this->fileSystem = is_null($fileSystem) ? new Filesystem : $fileSystem;
    }

    /**
     * Crate symfony finder instance
     *
     * @return object
     */
    protected function createFinder()
    {
        return new SymfonyFinder;
    }

    /**
     * Crate image instance
     *
     * @return object
     */
    protected function createImage()
    {
        return new Image;
    }

    /**
     * Clean path, add root and fixes trailing slash, etc.
     *
     * @param string $path
     * @return string
     */
    protected function preparePath($path)
    {
        return realpath(implode(DIRECTORY_SEPARATOR, [$this->root, trim($path, DIRECTORY_SEPARATOR)]));
    }

    /**
     * List file in specified path
     *
     * @param string $relativePath
     * @return array
     */
    public function ls($relativePath)
    {
        $path = $this->preparePath($relativePath);

        $finder = $this->createFinder();
        $finder->in($path)->depth(0)->sortByType();

        $items = [];
        foreach ($finder as $item) {

            $instance = $item;

            // if file is image, chekk if there is thumbnail already exist
            // create one if no thumbnail found
            if ($this->isImage($instance)) {

                $relative = $this->fileSystem->makePathRelative(pathinfo($instance->getRealPath(), PATHINFO_DIRNAME), $this->root);

                $thumbnailPath = $this->root.'/.thumb/'.$relative.'/thumbnail_'.$instance->getFileName();

                if(!is_file($thumbnailPath)) {
                    $this->createThumbnail($instance->getRealPath(), $thumbnailPath);
                }

                $instance->isImage = true;
                $instance->thumbnail = $thumbnailPath;
            }

            $items[] = $this->format($instance);
        }
        
        return $items;
    }

    /**
     * Delete given path, either folder or file.
     *
     * @param string $relativePath
     * @return array
     */
    public function delete($relativePath)
    {
        $path = $this->preparePath($relativePath);
        $instance = new \SplFileInfo($path);

        $items = [];

        if ($this->isImage($path)) {

            $relative = $this->fileSystem->makePathRelative(pathinfo($instance->getRealPath(), PATHINFO_DIRNAME), $this->root);
            $thumbnailPath = $this->root.'/.thumb/'.$relative.'/thumbnail_'.$instance->getFileName();

            if(is_file($thumbnailPath)) {
                $this->fileSystem->remove($thumbnailPath);
            }
        }

        $this->fileSystem->remove($path);
        $items['status'] = 'success';
        $items['message'] = "$relativePath just deleted";
        
        return $items;
    }

    /**
     * Create folder on specified parent
     *
     * @param string $path;
     * @param string $folderName;
     * @return array;
     */
    public function mkdir($path, $folderName)
    {
        try {

            $path = $this->preparePath($path);

            $this->fileSystem->mkdir($path.'/'.$folderName);

            $data['created'] = $folderName;
            $data['status'] = 'success';
            $data['message'] = "Folder '$folderName' just created";
            
            return $data;
        } catch (IOExceptionInterface $e) {
            $data['message'] = $e->getMessage();
            $data['status'] = 'error';
        }
        
        return $data;
    }

    public function rename($path, $newName)
    {
        try {

            $path = $this->preparePath($path);

            $tmp = explode(DIRECTORY_SEPARATOR, $path);
            array_pop($tmp);
            array_push($tmp, $newName);

            $newPath = implode(DIRECTORY_SEPARATOR, $tmp);

            $this->fileSystem->rename($path, $newPath);

            $data['status'] = 'success';            
            $data['newName'] = $newName;
            
            return $data;

        } catch (IOExceptionInterface $e) {
            $data['message'] = $e->getMessage();
            $data['status'] = 'error';
        }
    }

    public function move($path, $dest)
    {
        try {

            $path = $this->preparePath($path);
            $dest = $this->preparePath($dest);

            $tmp = explode(DIRECTORY_SEPARATOR, $path);
            $fileName = array_pop($tmp);

            $dest .= DIRECTORY_SEPARATOR.$fileName;

            $this->fileSystem->rename($path, $dest);

            $data['status'] = 'success';
            
            return $data;

        } catch (IOExceptionInterface $e) {
            $data['message'] = $e->getMessage();
            $data['status'] = 'error';
        }
    }

    /**
     * Format data returned to client
     *
     * @param SplFileInfo $file
     * @return array
     */
    protected function format($file)
    {
        $path = trim($this->fileSystem->makePathRelative($file->getRealPath(), $this->root), '/');

        $type = 'file';

        if($file->isDir()) {
            $type = 'dir';
        } else if (isset($file->isImage)) {
            $type = 'image';
        }

        return [
            'thumbnail' => isset($file->thumbnail) ? $file->thumbnail : false,
            'base64' => isset($file->thumbnail) ? $this->getBase64Image($file->thumbnail) : false,
            'type' => $type,
            'path' => $path,
            'label' => $file->getFileName()
        ];
    }

    /**
     * Creat image thumbnail and save in given destination
     *
     * @param string $source
     * @param string $dest
     * @param string $width
     * @param string $height
     * @return void
     */
    private function createThumbnail($src, $dest, $width = null, $height = 60)
    {
        $this->createImage()->fromFile($src)
                ->resize($width, $height)
                ->save($dest);
    }

    /**
     * Check if a filepath is image or not
     *
     * @param string $file
     */
    private function isImage($file) {

        return false !== @getimagesize($file);
    }

    /**
     * Get base64 string encoded image;
     *
     * @param string $path
     * @param string $type
     * @return string
     */
    private function getBase64Image($path, $type = "jpg")
    {
        $mime = $type;
        if ($mime == 'jpg') {
            $mime = 'jpeg';
        }

        return 'data:image/'.$mime.';base64,'.base64_encode(file_get_contents($path));
    }

    /**
     * Upload file
     *
     * @param string $relpath
     * @param array $files
     * @return array
     */
    public function upload($relpath, $files) {

        $path = $this->preparePath($relpath);

        $returned = [];

        foreach ($files as $file) {

            $array = [];
            
            if ($file instanceof UploadedFile ) {

                $name = $file->getClientOriginalName();
                if($file->move($path, $name)) {
                    $array['status'] = 'ok';
                    $array['uploaded'] = $relpath.'/'.$name;
                }
            }

            $returned[] = $array;
        }

        return $returned;
    }

    public function properties($path)
    {
        $path = $this->preparePath($path);

        $file = new \SplFileInfo($path);

        $data['Name'] = $file->getFileName();
        $data['Type'] = $file->getType();
        $data['Size'] = $file->getSize() .' b';
        $data['Location'] = $this->fileSystem->makePathRelative(pathinfo($file->getRealPath(), PATHINFO_DIRNAME), $this->root);

        return $data;
    }
}