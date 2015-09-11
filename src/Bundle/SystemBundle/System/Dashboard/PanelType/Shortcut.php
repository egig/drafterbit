<?php

namespace Drafterbit\Bundle\SystemBundle\System\Dashboard\PanelType;

use Drafterbit\System\Dashboard\PanelType;
use Drafterbit\System\Extension\Shortcut as ShortcutItem;

class Shortcut extends PanelType {

    protected $shortcuts;

    public function getView()
    {
        $extension_manager = $this->container->get('extension_manager');
        $shortcuts = $extension_manager->get('shortcuts');

        foreach ($shortcuts as $shortcut) {
            $this->addShortcut($shortcut);
        }

        $data['shortcuts'] = $this->shortcuts;

        return $this->renderView('SystemBundle:Panel:shortcuts.html.twig', $data);
    }

    public function getName()
    {
        return 'Shortcut';
    }

    protected function addShortcut(ShortcutItem $shortcut)
    {
        $this->shortcuts[$shortcut->getText()] = $shortcut;
    }
}