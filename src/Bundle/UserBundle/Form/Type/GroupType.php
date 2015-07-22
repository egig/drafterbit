<?php

namespace Drafterbit\Bundle\UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

class GroupType extends AbstractType
{
    protected $roles;

    public function __construct($roles = [])
    {
        $this->roles = $roles;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id', 'hidden', ['required' => false, 'mapped' => false])
            ->add('name', 'text')
            ->add('description', 'textarea', ['required' => false])
            ->add('roles', 'choice', [
                'choices'  => $this->roles,
                'required' => false,
                'multiple' => true,
                'expanded' => true
            ])
            ->add('Save', 'submit');
    }

    public function getName()
    {
        return 'group';
    }
}
