<?php namespace Drafterbit\Base;

trait RootTrait {

    /**
     * Class path.
     *
     * @var array
     */
    protected $root;

    /**
     * Get the application root path;
     *
     * @param string $sub
     * @return string
     */
    public function getRoot($sub = null)
    {
        if (null === $this->root) {
            $r = new \ReflectionObject($this);
            $this->root = str_replace('\\', '/', dirname($r->getFileName()).'/');
        }

        if (null !== $sub) {
            return $this->root.$sub;
        }

        return $this->root;
    }

    /**
     * Get Resource path.
     *
     * @param string $path
     * @return string
     */
    public function getResourcesPath($path = null)
    {
        $path = is_null($path) ? 'Resources' : "Resources/$path";

        return $this->getRoot($path);
    }
}