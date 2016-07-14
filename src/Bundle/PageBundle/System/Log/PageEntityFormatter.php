<?php

namespace drafterbit\Bundle\PageBundle\System\Log;

use drafterbit\Core\Log\BaseEntityFormatter;

class PageEntityFormatter extends BaseEntityFormatter
{
    public function getName()
    {
        return 'page';
    }

    public function format($id)
    {
        $em = $this->getKernel()->getContainer()->get('doctrine')->getManager();
        $post = $em->getRepository('PageBundle:Page')->find($id);

        $url = $this->getKernel()
            ->getContainer()
            ->get('router')
            ->generate('dt_page_edit', ['id' => $id]);

        if ($post) {
            $label = $post->getTitle();

            return '<a href="'.$url.'">'.$label.'</a>';
        }

        return '<em>Unknown</em>';
    }
}
