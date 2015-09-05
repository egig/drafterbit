<?php

namespace Drafterbit\Bundle\DistributionBundle\Installer\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Drafterbit\Bundle\DistributionBundle\Installer\Step\DoctrineStep;
use Symfony\Component\Validator\Constraints\NotBlank;

class SiteStepType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
       $builder->add('sitename', 'text')
        ->add('sitedesc', 'text')
        ->add('Save', 'submit');
    }

    public function getName()
    {
        return 'sitestep';
    }
}