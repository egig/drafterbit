<?php

namespace Drafterbit\Bundle\SystemBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class DashboardType extends AbstractType
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('panels', 'choice', [
            'multiple' => true,
            'expanded' => true,
            'choices' => $this->getChoices(),
            'data' => $this->container->get('system')->get('dashboard.panels')
        ]);
    }

    private function getChoices()
    {
        $choices = [];
        foreach ($this->container->get('dashboard')->getPanels()
             as $name => $panel) {
            $choices[$panel->getName()] = $panel->getTitle();
        }

        return $choices;
    }

    public function getName()
    {
        return 'dashboard';
    }
}