<?php

namespace Drafterbit\Bundle\SystemBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Drafterbit\System\FrontPage\FrontPageProvider;
use Drafterbit\Bundle\SystemBundle\Model\System as SystemModel;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

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
            ->add('site_name', 'text', ['data' => $this->data('system.site_name')])
            ->add('site_description', 'text', ['data' => $this->data('system.site_description')])
            ->add('frontpage', new FrontpageType($this->container), [
                'data' => $this->data('system.frontpage')
            ])
            ->add('email', null, ['data' => $this->data('system.email')])
            ->add('timezone', 'choice', [
                'data' => $this->data('system.timezone'),
                'choices' => array_combine(timezone_identifiers_list(), timezone_identifiers_list())
            ])
            ->add('date_format', null, ['data' => $this->data('system.date_format')])
            ->add('time_format', null, ['data' => $this->data('system.time_format')]);
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults([
            'required' => false,
            'mapped' => false,
            'csrf_protection' => true,
            'intention' => 'system_type'
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