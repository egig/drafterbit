<?php

namespace drafterbit\Bundle\BlogBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use drafterbit\Bundle\SystemBundle\Form\Type\EntityHiddenType;

class CommentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('authorName', TextType::class, ['required' => true, 'label' => 'Name'])
            ->add('authorEmail', TextType::class, ['required' => true, 'label' => 'Email'])
            ->add('authorUrl', TextType::class)
            ->add('post', EntityHiddenType::class, [
                'class' => 'BlogBundle:Post',
                ])
            ->add('parent', EntityHiddenType::class, [
                'class' => 'BlogBundle:Comment',
                ])
            ->add('content', TextareaType::class, ['required' => true, 'label' => 'Content'])
            ->add('subscribe', CheckboxType::class, [
                'label' => 'Notify me of followup comments via e-mail',
                'required' => false,
            ])
            ->add('Submit', SubmitType::class);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'required' => false,
        ]);
    }

    public function getName()
    {
        return 'blog_comment';
    }
}
