<?php

namespace drafterbit\Bundle\CoreBundle\System\Widget;

use Symfony\Component\Form\Form;
use drafterbit\Core\Widget\Widget;

class MetaWidget extends Widget
{
    public function getName()
    {
        return 'meta';
    }

    public function run($context = null)
    {
        $baseUrl = $this->container->get('request_stack')->getCurrentRequest()->getBaseUrl();
        $admin = $this->container->getParameter('admin');
        $items = [
            ['link' => $baseUrl.'/'.$admin, 'label' => 'Site Admin'],
            ['link' => 'http://drafterbit', 'label' => 'drafterbit.org'],
        ];

        $data['items'] = $items;

        return $this->container->get('templating')->render('widgets/meta.html.twig', $data);
    }

    public function buildForm(Form $form)
    {
        return $form;
    }
}
