<?php

namespace Drafterbit\Bundle\SystemBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Drafterbit\System\FrontPage\FrontPageProvider;
use Drafterbit\Bundle\SystemBundle\Model\System as SystemModel;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class SystemType extends AbstractType
{
    protected $systemModel;
    protected $frontpageProvider;

    public function __construct(SystemModel $systemModel, FrontPageProvider $frontpageProvider)
    {
        $this->systemModel = $systemModel;
        $this->frontpageProvider = $frontpageProvider;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('sitename', 'text', ['data' => $this->data('sitename')])
            ->add('tagline', 'text', ['data' => $this->data('tagline')])
            ->add('frontpage', new FrontpageType($this->frontpageProvider), [
                'data' => $this->data('frontpage')
            ])
            ->add('email', null, ['data' => $this->data('email')])
            ->add('timezone', 'choice', [
                'data' => $this->data('timezone'),
                'choices' => array_combine(timezone_identifiers_list(), timezone_identifiers_list())
            ])
            ->add('date_format', null, ['data' => $this->data('date_format')])
            ->add('time_format', null, ['data' => $this->data('time_format')])
            ->add('Save', 'submit');
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
        return  $this->systemModel->get($key);
    }
}