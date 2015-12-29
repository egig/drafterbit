<?php

namespace Drafterbit\Bundle\DistributionBundle\Installer\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Drafterbit\Bundle\DistributionBundle\Installer\Step\DoctrineStep;
use Symfony\Component\Validator\Constraints\NotBlank;

class AccountStepType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
       $builder->add('username', TextType::class)
            ->add('password', PasswordType::class, array('required' => false))
            ->add('Save', SubmitType::class);
    }

    public function getName()
    {
        return 'accountstep';
    }
}
