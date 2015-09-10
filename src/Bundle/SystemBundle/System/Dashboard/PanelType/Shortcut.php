<?php

namespace Drafterbit\Bundle\SystemBundle\System\Dashboard\PanelType;

use Drafterbit\System\Dashboard\PanelType;

class Shortcut extends PanelType {

    public function getView()
    {
        $extension_manager = $this->container->get('extension_manager');
        $shortcuts = $extension_manager->get('shortcuts');
        $data['shortcuts'] = $shortcuts;

        foreach ($shortcuts as $shortcut) {
            if(! $shortcut instanceof \Drafterbit\System\Extension\Shortcut) {
                throw new \InvalidArgumentException(get_class($shortcut)." must be instanceof Drafterbit\System\Extension\Shortcut");
            }
        }

        return $this->renderView('SystemBundle:Panel:shortcuts.html.twig', $data);
    }

    public function getName()
    {
        return 'Shortcut';
    }
}