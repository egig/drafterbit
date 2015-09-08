<?php

namespace Drafterbit\Bundle\SystemBundle\Form\Type\Panel;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\DependencyInjection\ContainerInterface;

class LogType extends AbstractType
{
    protected $container;

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('num', 'number');
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'required' => false,
            'mapped' => false,
            'csrf_protection' => true,
            'intention' => 'panel_type'
        ]);
    }

    public function getName()
    {
        return 'context';
    }
}
