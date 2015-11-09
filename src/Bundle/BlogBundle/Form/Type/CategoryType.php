<?php

namespace Drafterbit\Bundle\BlogBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CategoryType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        // @todo Category parent-children relation level

        $builder
            ->add('id', 'hidden', ['mapped' => false])
            ->add('label', 'text', ['required' => true])
            ->add('slug', 'text', ['required' => true])
            ->add('description', 'textarea')
            ->add('parent', 'entity', [
                'placeholder' => 'No Parent',
                'required' => false,
                'property' => 'label',
                'class' => 'BlogBundle:Category',
                ]
            )
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
        return 'blog_category';
    }
}