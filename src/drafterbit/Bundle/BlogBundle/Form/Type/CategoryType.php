<?php

namespace drafterbit\Bundle\BlogBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

class CategoryType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        // @todo Category parent-children relation level

        $builder
            ->add('id', HiddenType::class, ['mapped' => false])
            ->add('label', TextType::class, ['required' => true])
            ->add('slug', TextType::class, ['required' => true])
            ->add('description', TextareaType::class)
            ->add('parent', EntityType::class, [
                'placeholder' => 'No Parent',
                'required' => false,
                'choice_label' => 'label',
                'class' => 'BlogBundle:Category',
                ]
            )
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
        return 'blog_category';
    }
}
