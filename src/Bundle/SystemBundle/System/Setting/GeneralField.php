<?php

namespace Drafterbit\Bundle\SystemBundle\System\Setting;

use Drafterbit\System\Setting\Field;
use Drafterbit\Bundle\SystemBundle\Form\Type\SystemType;

class GeneralField extends Field {

    public function getFormType()
    {
        return new SystemType($this->container);
    }

    public function getTemplate()
    {
        return 'SystemBundle:Setting/Field:system.html.twig';
    }
}
