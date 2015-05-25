<?php

namespace Drafterbit\Bundle\SystemBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class WidgetType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id', 'hidden', ['mapped' => false])
            ->add('name', 'hidden')
            ->add('theme', 'hidden')
            ->add('position', 'hidden');
    }

    public function getName()
    {
        return 'widget';
    }
}