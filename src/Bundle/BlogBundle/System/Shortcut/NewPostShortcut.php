<?php

namespace Drafterbit\Bundle\BlogBundle\System\Shortcut;

use Drafterbit\System\Extension\Shortcut;

class NewPostShortcut extends Shortcut {
    
    public function getUrl()
    {
        return $this->container->get('router')
            ->generate('dt_blog_post_edit', ['id' => 'new']);
    }

    public function getText()
    {
        return "New Post";
    }

    public function getIconClass()
    {
        return 'fa fa-edit';
    }
}