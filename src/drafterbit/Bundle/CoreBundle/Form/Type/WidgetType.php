<?php

namespace drafterbit\Bundle\CoreBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

class WidgetType extends AbstractType
{
    const INTENTION = 'widget_type';

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id', HiddenType::class, ['mapped' => false])
            ->add('name', HiddenType::class)
            ->add('theme', HiddenType::class)
            ->add('position', HiddenType::class);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'csrf_protection' => true,
            'intention' => static::INTENTION,
            'allow_extra_fields' => true,
        ]);
    }

    public function getName()
    {
        return 'widget';
    }
}
