<?php

namespace drafterbit\Bundle\UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class GroupType extends AbstractType
{
    protected $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $rolesGroup = $this->getRoles();

        $roles = [];
        foreach ($rolesGroup as $bundle => $attributes) {
            foreach ($attributes as $key => $value) {
                $roles[$value] = $key;
            }
        }

        $builder
            ->add('id', HiddenType::class, ['required' => false, 'mapped' => false])
            ->add('name', TextType::class)
            ->add('description', TextareaType::class, ['required' => false])
            ->add('roles', ChoiceType::class, [
                'choices' => $roles,
                'required' => false,
                'multiple' => true,
                'expanded' => true,
            ])
            ->add('Save', SubmitType::class);
    }

    public function getName()
    {
        return 'group';
    }

    private function getRoles()
    {
        $bundles = $this->container->get('kernel')->getBundles();
        $roles = [];
        foreach ($bundles as $name => $bundle) {
            if ($extension = $bundle->getContainerExtension()) {
                $parameter = $extension->getAlias().'.roles';
                $section = ucfirst(preg_replace('/^dt_/', '', $extension->getAlias()));
                if ($this->container->hasParameter($parameter)) {
                    $roles[$section] = $this->container->getParameter($parameter);
                }
            }
        }

        return $roles;
    }
}
