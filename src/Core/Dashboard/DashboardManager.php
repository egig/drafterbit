<?php

namespace drafterbit\Core\Dashboard;

class DashboardManager
{
    /**
     * @var array
     */
    protected $panelTypes = [];

    /**
     * Add a panel types.
     *
     * @param PanelTypeInterface $panel
     */
    public function addPanelType(PanelTypeInterface $panelType)
    {
        $this->panelTypes[$panelType->getName()] = $panelType;
    }

    /**
     * Get all available panel types.
     *
     * @return array
     */
    public function getPanelTypes()
    {
        return $this->panelTypes;
    }

    /**
     * Get panel by name.
     *
     * @return PanelType
     */
    public function getPanelType($name)
    {
        // @todo validate name ??
        if (isset($this->panelTypes[$name])) {
            return $this->panelTypes[$name];
        }

        throw new \InvalidArgumentException("Trying to get unregistered panel type: $name");
    }
}
