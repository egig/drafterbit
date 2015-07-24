<?php

namespace Drafterbit\Bundle\SystemBundle\System\Widget;

use Symfony\Component\Form\Form;
use Drafterbit\System\Widget\Widget;

class SearchWidget extends Widget
{
    function getName()
    {
        return 'search';
    }

    public function run($context = null)
    {
        return $this->container->get('templating')->render('widgets/search/form.html.twig');
    }

    public function buildForm(Form $form)
    {
        return $form;
    }
}
