<?php

namespace drafterbit\Bundle\UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id', HiddenType::class, ['mapped' => false])
            ->add('username', TextType::class, ['required' => true])
            ->add('email', EmailType::class)
            ->add('password', RepeatedType::class, array(
                'mapped' => false,
                'type' => PasswordType::class,
                'invalid_message' => 'The password fields must match',
                'options' => array('attr' => array('class' => 'form-control')),
                'required' => true,
                'first_options' => array('label' => 'Repeat Password'),
                'second_options' => array('label' => 'Password'),
            ))
            ->add('realname', TextType::class)
            ->add('url', UrlType::class)
            ->add('bio', TextareaType::Class)
            ->add('groups', EntityType::class, [
                'class' => 'UserBundle:Group',
                'choice_label' => 'name',
                'multiple' => true,
            ])
            ->add('enabled', ChoiceType::class, [
                'choices' => ['Enabled' => '1', 'Disabled' => ''],
                'required' => true,
                'multiple' => false,
                'expanded' => true,
            ])
            ->add('Save', SubmitType::class);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'required' => false,
        ]);
    }

    public function getName()
    {
        return 'user';
    }
}
