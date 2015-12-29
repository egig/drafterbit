<?php

namespace Drafterbit\Bundle\BlogBundle\System\Extension;

use Drafterbit\System\Extension\Extension;
use Drafterbit\Bundle\BlogBundle\System\Shortcut\NewPostShortcut;

class BlogExtension extends Extension {

    public function getName()
    {
        return 'blog';
    }

    public function getShortcuts()
    {
        return [
            new NewPostShortcut()
        ];
    }
}