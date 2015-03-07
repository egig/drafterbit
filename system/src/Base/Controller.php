<?php namespace Drafterbit\Base;

use Symfony\Component\HttpFoundation\JsonResponse;

abstract class Controller implements \ArrayAccess {

    use ApplicationTrait;

    /**
     * Namespace origin is helper for namespaceparser
     *
     * @var string
     */
    protected $namespaceOrigin = 'Controllers';

    /**
     * Render Template.
     *
     * @param string $template
     * @param array $data
     */
    public function render($template, $data = [])
    {
        if(strpos($template, '@') === false) {
            $path = $this->getExtension()->getResourcesPath('views');

            if(file_exists($path.'/'.rtrim($template,'.php').'.php')) {
                $template = '@'.$this->getExtension()->getName().'/'.$template;
            }
        }
        
        return $this['template']->render($template, $data);
    }

    /**
     * Validation
     *
     * @param array $data
     * @param string
     */
    public function validate($ruleKey, $data)
    {
        $validator = $this['validation.form'];

        $rules = $this['config']->get('validation.'.$ruleKey.'@'.$this->getExtension()->getName());

        $validator
            ->setRules($rules)
            ->validate($data);

        return $validator;
    }

    /**
     * Get Extension by given name or for current controller.
     *
     *  @return Drafterbit\Base\Extension
     */
    public function getExtension($name = null)
    {
        // if no ext passed, we'll grab current
        if(is_null($name)) {

            $r = new \ReflectionObject($this);
            $ns = $r->getNamespaceName();

            $array = explode('\\', $ns);

            $i = array_search($this->getNamespaceOrigin(), $array) - 1;

            $name = snake_case($array[$i], '-');
        }

        return $this['app']->getExtension($name);
    }

    /**
     * Get model.
     *
     * @return Drafterbit\Base\Model
     */
    public function model($key)
    {
        return $this->getExtension()->model($key);
    }

    /**
     * Check if coming request is ajax.
     *
     * @return bool
     */
    public function isAjax()
    {
        return $this->get('input')->isAjax();
    }

    /**
     * Creat json response
     *
     * @return object
     */
    public function jsonResponse($data)
    {
        return new jsonResponse($data);
    }

    private function getNamespaceOrigin()
    {
        return $this->namespaceOrigin;
    }
}