<?php namespace Drafterbit\Base;

use ArrayAccess;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

abstract class Extension implements ArrayAccess {
    use RootTrait, ContainerTrait;

    /**
     * Get class type 'name';
     *
     * @return string
     */

    public function getName() {

        $_r = new \ReflectionObject($this);
        $_ns = $_r->getNamespaceName();
        $_arr = explode('\\', $_ns);

        if(count($_arr) > 0) {
            return snake_case(end($_arr), '-');
        }

        return false;
    }

    /**
     * Get Namespace.
     *
     * @return string $key
     */
    public function getNamespace()
    {
        return (new \ReflectionObject($this))->getNamespaceName();
    }

    /**
     * resolved models
     *
     * @var array
     */
    protected $resolvedModels = [];

    /**
     * Get model.
     *
     * @return Drafterbit\Base\Model
     */
    public function model($key)
    {
        if(in_array($key, $this->resolvedModels)) {
            return $this->resolvedModels[$key];
        }

        if($key[0] == '@') {

            $temp = explode('\\', $key);

            $name = ltrim(array_shift($temp),'@');
            $class = implode('\\', $temp);

            if( ! $extension = $this['extension']->get($name)) {
                throw new \InvalidArgumentException("Extension $name doesn't exist");
            }

            $namespace = $extension->getNamespace()."\\Models\\";
            $key = $namespace.$class;
                    
        } else {

            $key = studly_case($key);
            $namespace = $this->getNamespace()."\\Models\\";
            $moduleKey = $namespace.$key;

            if (class_exists($moduleKey)) {
                $key = $moduleKey;
            }
        }
        
        return $this->resolvedModels[$key] = $this['builder']->build($key);
    }

    public function __call($method, $args)
    {
        return call_user_func_array([ContainerTrait::getInstance(), $method], $args);
    }
}