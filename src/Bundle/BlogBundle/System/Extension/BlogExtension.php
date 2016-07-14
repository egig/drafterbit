<?php

namespace drafterbit\Bundle\BlogBundle\System\Extension;

use drafterbit\Core\Extension\Extension;
use drafterbit\Bundle\BlogBundle\System\Shortcut\NewPostShortcut;

class BlogExtension extends Extension
{
    public function getName()
    {
        return 'blog';
    }

    public function getShortcuts()
    {
        return [
            new NewPostShortcut(),
        ];
    }
}
