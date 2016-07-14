<?php

namespace drafterbit\Bundle\CoreBundle\System\Setting;

use drafterbit\Core\Setting\Field;
use drafterbit\Bundle\CoreBundle\Form\Type\SystemType;

class GeneralField extends Field
{
    public function getFormType()
    {
        return SystemType::class;
    }

    public function getTemplate()
    {
        return 'CoreBundle:Setting/Field:system.html.twig';
    }

    public function getName()
    {
        return 'system';
    }
}
