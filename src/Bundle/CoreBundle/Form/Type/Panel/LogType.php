<?php

namespace drafterbit\Bundle\CoreBundle\Form\Type\Panel;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\NumberType;

class LogType extends AbstractType
{
    private $data = [];

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        // @todo fix this, find a way to not manually add data to each field
        $num = empty($options['data']->num) ? 0 : $options['data']->num;

        $builder
            ->add('num', NumberType::class, ['mapped' => false, 'data' => $num]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'csrf_protection' => true,
            'intention' => 'panel_type',
        ]);
    }

    public function getName()
    {
        return 'context';
    }
}
