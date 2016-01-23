<?php

namespace Drafterbit\Bundle\SystemBundle\System\Widget;

use Symfony\Component\Form\Form;
use Drafterbit\System\Widget\Widget;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;

class TextWidget extends Widget
{
    public function getName()
    {
        return 'text';
    }

    public function run($context = null)
    {
        return $context['content'];
    }

    public function buildForm(Form $form)
    {
        $form->add('content', TextareaType::class, ['mapped' => false]);

        return $form;
    }
}
