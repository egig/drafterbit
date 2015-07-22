<?php

namespace Drafterbit\System\FrontPage;

class FrontPageProvider
{
    protected $frontpages;

    public function register( FrontpageInterface $frontpage)
    {
        $this->frontpages[$frontpage->getRoutePrefix()] = $frontpage;
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