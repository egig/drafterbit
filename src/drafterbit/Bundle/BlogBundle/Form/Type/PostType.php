<?php

namespace drafterbit\Bundle\BlogBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

class PostType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id', HiddenType::class, ['mapped' => false])
            ->add('title', TextType::class, ['required' => true])
            ->add('slug', TextType::class, ['required' => true])
            ->add('content', TextareaType::class)
            ->add('published_at', TextType::class, ['mapped' => false])
            ->add('categories', EntityType::class, [
                'class' => 'BlogBundle:Category',
                'choice_label' => 'label',
                'multiple' => true,
                'expanded' => true,
            ])
            /*->add('tags', 'entity', [
                'class' => 'BlogBundle:Tag',
                'choice_label' => 'label',
                'multiple' => true,
                'expanded' => false
            ])*/
            ->add('status', ChoiceType::class, [
                    'choices' => [
                        'Published' => 1,
                        'Pending Review' => 0,
                    ],
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
        return 'blog_post';
    }
}
