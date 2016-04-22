<?php

namespace drafterbit\Bundle\DistributionBundle\Installer\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use drafterbit\Bundle\DistributionBundle\Installer\Step\DoctrineStep;
use Symfony\Component\Validator\Constraints\NotBlank;

class DoctrineStepType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('driver', ChoiceType::class, array('choices' => DoctrineStep::getDrivers()))
            ->add('name', TextType::class, array(
                    'required' => false,
                    'constraints' => array(
                        new NotBlank(),
                    ),
                ))
            ->add('host', TextType::class, array('required' => false, 'data' => 'localhost'))
            ->add('path', TextType::class, array('required' => false))
            ->add('port', TextType::class, array('required' => false))
            ->add('user', TextType::class, array('required' => false))
            ->add('password', PasswordType::class, array('required' => false))
            ->add('table_prefix', TextType::class, array('required' => false, 'data' => 'dt_'))
            ->add('Save', SubmitType::class);
    }

    public function getName()
    {
        return 'doctrinestep';
    }
}
