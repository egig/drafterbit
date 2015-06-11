<?php

namespace Drafterbit\Bundle\SystemBundle;

class FrontpageProvider
{
    protected $frontpages;

    public function resolve($key)
    {
        if(strpos($key, ':') != false ) {
            $_temp = explode(':', $key);
            $name = reset($_temp);
        } else {
            $name = $key;
        }

        return $this->frontpages[$name]->resolve($key);
    }

    public function register( FrontpageInterface $frontpage)
    {
        $this->frontpages[$frontpage->getName()] = $frontpage;
    }

    public function has($name)
    {
        return isset($this->frontpages[$name]);
    }

    public function all()
    {
        return $this->frontpages;
    }
}