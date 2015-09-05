<?php

namespace Drafterbit\Bundle\DistributionBundle\Installer\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Drafterbit\Bundle\DistributionBundle\Installer\Step\DoctrineStep;
use Symfony\Component\Validator\Constraints\NotBlank;

class DoctrineStepType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
       $builder
            ->add('driver', 'choice', array('choices' => DoctrineStep::getDrivers()))
            ->add('name', 'text', array(
                    'required' => false,
                    'constraints' => array(
                        new NotBlank()
                    )
                ))
            ->add('host', 'text', array('required' => false, 'data' => 'localhost'))
            ->add('path', 'text', array('required' => false))
            ->add('port', 'text', array('required' => false))
            ->add('user', 'text', array('required' => false))
            ->add('password', 'password', array('required' => false))
            ->add('table_prefix', 'text', array('required' => false, 'data' => 'dt_'))
            ->add('Save', 'submit');
    }

    public function getName()
    {
        return 'doctrinestep';
    }
}