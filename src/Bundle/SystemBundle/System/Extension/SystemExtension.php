<?php

namespace Drafterbit\Bundle\SystemBundle\System\Extension;

use Drafterbit\System\Extension\Extension;
use Drafterbit\Bundle\SystemBundle\System\Shortcut\AppearanceShortcut;

class SystemExtension extends Extension {

    public function getName()
    {
        return 'system';
    }

    public function getShortcuts()
    {
        return [
            new AppearanceShortcut()
        ];
    }
}