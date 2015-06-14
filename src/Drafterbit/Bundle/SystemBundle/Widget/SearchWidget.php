<?php

namespace Drafterbit\Bundle\SystemBundle\Widget;

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
        return $this->container->get('templating')->render('widgets/search/form.html');
    }

    public function buildForm(Form $form)
    {
        return $form;
    }
}