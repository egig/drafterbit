<?php

namespace drafterbit\Bundle\CoreBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

class SystemType extends AbstractType
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('site_name', TextType::class, ['data' => $this->data('system.site_name')])
            ->add('site_description', TextType::class, ['data' => $this->data('system.site_description')])
            ->add('frontpage', FrontpageType::class, [
                'data' => $this->data('system.frontpage'),
            ])
            ->add('email', null, ['data' => $this->data('system.email')])
            ->add('timezone', ChoiceType::class, [
                'data' => $this->data('system.timezone'),
                'choices' => array_combine(timezone_identifiers_list(), timezone_identifiers_list()),
            ])
            ->add('date_format', null, ['data' => $this->data('system.date_format')])
            ->add('time_format', null, ['data' => $this->data('system.time_format')]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'required' => false,
            'mapped' => false,
            'csrf_protection' => true,
            'intention' => 'system_type',
        ]);
    }

    public function getName()
    {
        return 'system';
    }

    private function data($key)
    {
        return  $this->container->get('system')->get($key);
    }
}
