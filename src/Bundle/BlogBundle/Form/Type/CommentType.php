<?php

namespace Drafterbit\Bundle\BlogBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class CommentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('authorName', 'text', ['required' => true, 'label'=>'Name'])
            ->add('authorEmail', 'text', ['required' => true, 'label'=>'Email'])
            ->add('authorUrl', 'text')
            ->add('post', 'entity_hidden', [
                'class' => 'BlogBundle:Post',
                ])
            ->add('parent', 'entity_hidden', [
                'class' => 'BlogBundle:Comment',
                ])
            ->add('content', 'textarea', ['required' => true, 'label'=>'Content'])
            ->add('subscribe', 'checkbox', [
                'label'    => 'Notify me of followup comments via e-mail',
                'required' => false,
            ])
            ->add('Submit', 'submit');
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults([
            'required' => false
        ]);
    }

    public function getName()
    {
        return 'blog_comment';
    }
}