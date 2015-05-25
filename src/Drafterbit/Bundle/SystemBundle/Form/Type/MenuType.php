<?php

namespace Drafterbit\Bundle\SystemBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class MenuType extends AbstractType
{
     public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('display_text', 'text')
            ->add('Submit', 'submit');
    }

    public function getName()
    {
        return 'menu';
    }
}