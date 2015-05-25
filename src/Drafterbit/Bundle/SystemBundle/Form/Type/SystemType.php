<?php

namespace Drafterbit\Bundle\SystemBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Drafterbit\Bundle\SystemBundle\FrontpageProvider;

use Drafterbit\Bundle\SystemBundle\Model\System as SystemModel;

class SystemType extends AbstractType
{
    protected $systemModel;
    protected $frontpageProvider;

    public function __construct(SystemModel $systemModel, FrontpageProvider $frontpageProvider)
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
            'mapped' => false
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