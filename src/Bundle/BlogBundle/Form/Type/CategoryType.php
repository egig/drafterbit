<?php

namespace Drafterbit\Bundle\BlogBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class CategoryType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id', 'hidden', ['mapped' => false])
            ->add('label', 'text', ['required' => true])
            ->add('slug', 'text', ['required' => true])
            ->add('description', 'textarea')
            ->add('parent', 'entity', [
                'placeholder' => 'No Parent',
                'required' => false,
                'property' => 'label',
                'class' => 'DrafterbitBlogBundle:Category',
                ]
            )
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
        return 'blog_category';
    }
}