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
            ->add('author_name', 'text', ['required' => true])
            ->add('author_email', 'text', ['required' => true])
            ->add('author_url', 'text')
            ->add('post', 'entity_hidden', [
                'class' => 'DrafterbitBlogBundle:Post',
                ])
            ->add('parent', 'entity_hidden', [
                'class' => 'DrafterbitBlogBundle:Comment',
                ])
            ->add('content', 'textarea', ['required' => true])
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