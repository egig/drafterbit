<?php

namespace drafterbit\Core\Widget;

interface WidgetInterface
{
    public function getName();
    public function run();
    public function getFormView($type, $data = null, $options = []);
}
