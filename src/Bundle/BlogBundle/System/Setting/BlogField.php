<?php

namespace Drafterbit\Bundle\BlogBundle\System\Setting;

use Drafterbit\System\Setting\Field;
use Drafterbit\Bundle\BlogBundle\Form\Type\SettingType;

class BlogField extends Field {

    public function getFormType()
    {
        return new SettingType($this->container->get('system'));
    }

    public function getTemplate()
    {
        return 'BlogBundle:Setting/Field:blog.html.twig';
    }
}
