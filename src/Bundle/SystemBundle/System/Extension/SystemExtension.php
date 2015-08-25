<?php

namespace Drafterbit\Bundle\SystemBundle\System\Extension;

use Drafterbit\System\Extension\Extension;
use Drafterbit\Bundle\SystemBundle\System\Shortcuts\AppearanceShortcut;

class SystemExtension extends Extension {

    public function getName()
    {
        return 'system';
    }

    public function getShortcutsExtension()
    {
        $appearanceShortcut = new AppearanceShortcut();
        $appearanceShortcut->setContainer($this->container);

        return [
            $appearanceShortcut
        ];
    }
}