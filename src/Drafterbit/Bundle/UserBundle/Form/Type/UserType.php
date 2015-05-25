<?php

namespace Drafterbit\Bundle\UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id', 'hidden', ['mapped' => false])
            ->add('username', 'text', ['required' => true])
            ->add('email', 'email')
            ->add('password', 'repeated', array(
                'mapped' => false,
                'type' => 'password',
                'invalid_message' => 'The password fields must match',
                'options' => array('attr' => array('class' => 'form-control')),
                'required' => true,
                'first_options'  => array('label' => 'Repeat Password'),
                'second_options' => array('label' => 'Password'),
            ))
            ->add('realname', 'text')
            ->add('url', 'url')
            ->add('bio', 'textarea')
            ->add('groups', 'entity', [
                'class' => 'DrafterbitUserBundle:Group',
                'property' => 'name',
                'multiple' => true,
            ])
            ->add('enabled', 'choice', [
                'choices'  => [1 => 'Enabled', 0 => 'Disabled'],
                'required' => true,
                'multiple' => false,
                'expanded' => true
            ])
            ->add('Save', 'submit');
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults([
            'required' => false
        ]);
    }

    public function getName()
    {
        return 'user';
    }
}
