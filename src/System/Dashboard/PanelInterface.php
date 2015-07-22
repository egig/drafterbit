<?php

namespace Drafterbit\System\Dashboard;

interface PanelInterface {

    /**
     * Get panel view
     *
     * @return string
     */
    public function getView();

    /**
     * Get panel name
     *
     * @return string
     */
    public function getName();

    /**
     * Get panel position, left or right
     *
     * @return string
     */
    public function getPosition();
    
    public function setPosition($position);
}