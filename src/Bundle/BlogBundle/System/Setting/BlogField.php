<?php

namespace drafterbit\Bundle\BlogBundle\System\Setting;

use drafterbit\System\Setting\Field;
use drafterbit\Bundle\BlogBundle\Form\Type\SettingType;

class BlogField extends Field
{
    public function getFormType()
    {
        return SettingType::class;
    }

    public function getTemplate()
    {
        return 'BlogBundle:Setting/Field:blog.html.twig';
    }

    public function getName()
    {
        return 'blog';
    }
}
