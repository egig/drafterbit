<?php

namespace drafterbit\Bundle\DistributionBundle\Installer\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class SiteStepType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('sitename', TextType::class)
        ->add('sitedesc', TextType::class)
        ->add('Save', SubmitType::class);
    }

    public function getName()
    {
        return 'sitestep';
    }
}
