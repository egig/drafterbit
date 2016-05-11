<?php

namespace drafterbit\Bundle\CoreBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

class ThemeType extends AbstractType
{
    const CSRF_TOKEN_ID = 'theme_setting';

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        //..
    }
}
