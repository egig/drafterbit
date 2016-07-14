<?php

namespace drafterbit\Bundle\CoreBundle\System\Widget;

use Symfony\Component\Form\Form;
use drafterbit\Core\Widget\Widget;

class SearchWidget extends Widget
{
    public function getName()
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
