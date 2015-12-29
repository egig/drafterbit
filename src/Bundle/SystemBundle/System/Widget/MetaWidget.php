<?php

namespace Drafterbit\Bundle\SystemBundle\System\Widget;

use Symfony\Component\Form\Form;
use Drafterbit\System\Widget\Widget;

class MetaWidget extends Widget
{
    function getName()
    {
        return 'meta';
    }

    public function run($context = null)
    {
        $baseUrl =  $this->container->get('request_stack')->getCurrentRequest()->getBaseUrl();
        $admin = $this->container->getParameter('admin');
        $items = [
            ['link' => $baseUrl.'/'.$admin, 'label' => 'Site Admin'],
            ['link' => $baseUrl.'/feed.xml', 'label' => 'Feed RSS'],
            ['link' => 'http://drafterbit', 'label' => 'Drafterbit.org']
        ];

        $data['items'] = $items;
        return $this->container->get('templating')->render('widgets/meta.html.twig', $data);
    }

    public function buildForm(Form $form)
    {
        return $form;
    }
}