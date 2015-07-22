<?php

namespace Drafterbit\System\Dashboard;

class DashboardManager
{
    protected $panels = [];

    /**
     * add a panel
     *
     * @param PanelInterface $panel
     */
    public function addPanel(PanelInterface $panel)
    {
        $this->panels[$panel->getName()] = $panel;
    }

    public function getPanels()
    {
        return $this->panels;
    }

    /**
     * Get panel by name
     */
    public function getPanel($name)
    {
        if(isset($this->panels[$name])) {
            return $this->panels[$name];
        }

        throw new \InvalidArgumentException("Trying to get unregistered panel: $name");
    }
}
