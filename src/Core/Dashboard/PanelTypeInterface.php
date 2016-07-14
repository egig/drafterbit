<?php

namespace drafterbit\Core\Dashboard;

interface PanelTypeInterface
{
    /**
     * Get panel view.
     *
     * @return string
     */
    public function getView();

    /**
     * Get panel name.
     *
     * @return string
     */
    public function getName();
}
