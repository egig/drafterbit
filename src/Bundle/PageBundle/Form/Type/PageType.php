<?php

namespace Drafterbit\Bundle\PageBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class PageType extends AbstractType
{
    private $layoutOptions = [];

    public function __construct(array $layoutOptions) {
        $this->layoutOptions = $layoutOptions;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id', 'hidden', ['mapped' => false])
            ->add('title', 'text', ['required' => true])
            ->add('slug', 'text', ['required' => true])
            ->add('content', 'textarea')
            ->add('layout', 'choice', [
                    'choices' => $this->layoutOptions
                ])
            ->add('status', 'choice', [
                    'choices' => [
                        1 => 'Published',
                        0 => 'Pending Review',
                    ]
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
        return 'page';
    }
}
