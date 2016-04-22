<?php

namespace drafterbit\Bundle\SystemBundle\System\Setting;

use drafterbit\System\Setting\Field;
use drafterbit\Bundle\SystemBundle\Form\Type\SystemType;

class GeneralField extends Field
{
    public function getFormType()
    {
        return SystemType::class;
    }

    public function getTemplate()
    {
        return 'SystemBundle:Setting/Field:system.html.twig';
    }

    public function getName()
    {
        return 'system';
    }
}
