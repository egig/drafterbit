<?php

namespace Drafterbit\Bundle\SystemBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

use Drafterbit\Bundle\SystemBundle\frontpageProvider;

class FrontpageType extends AbstractType
{
    private $frontpageProvider;

    public function __construct(frontpageProvider $frontpageProvider)
    {
        $this->frontpageProvider = $frontpageProvider;
    }


    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $options = [];

        foreach ($this->frontpageProvider->all() as $name => $frontapage) {

            if($frontapage->getType() == 'cascade' ) {
                $options[$name] = $frontapage->getOptions();
            } else {
                $options[$name] = $frontapage->getLabel();
            }
        }

        $resolver->setDefaults(array(
            'choices' => $options
        ));
    }

    public function getParent()
    {
        return 'choice';
    }

    public function getName()
    {
        return 'frontapage';
    }
}