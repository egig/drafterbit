<?php

namespace Drafterbit\Bundle\BlogBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PostType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id', 'hidden', ['mapped' => false])
            ->add('title', 'text', ['required' => true])
            ->add('slug', 'text', ['required' => true])
            ->add('content', 'textarea')
            ->add('published_at', 'text', ['mapped' =>false])
            ->add('categories', 'entity', [
                'class' => 'BlogBundle:Category',
                'property' => 'label',
                'multiple' => true,
                'expanded' => true
            ])
            /*->add('tags', 'entity', [
                'class' => 'BlogBundle:Tag',
                'property' => 'label',
                'multiple' => true,
                'expanded' => false
            ])*/
            ->add('status', 'choice', [
                    'choices' => [
                        1 => 'Published',
                        0 => 'Pending Review',
                    ]
                ])
            ->add('Save', 'submit');
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'required' => false
        ]);
    }

    public function getName()
    {
        return 'blog_post';
    }
}