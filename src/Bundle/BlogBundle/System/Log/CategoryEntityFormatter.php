<?php

namespace Drafterbit\Bundle\BlogBundle\System\Log;

use Drafterbit\System\Log\BaseEntityFormatter;

class CategoryEntityFormatter extends BaseEntityFormatter
{
    public function getName()
    {
        return 'category';
    }

    public function format($id)
    {
        $em = $this->getKernel()->getContainer()->get('doctrine')->getManager();
        $cat = $em->getRepository('BlogBundle:Category')->find($id);

        if ($cat) {
            $label = $cat->getLabel();
        } else {
            $label = "with id $id(deleted)";
        }

        $url = $this->getKernel()
            ->getContainer()
            ->get('router')
            ->generate('dt_blog_category_edit', ['id' => $id]);

        if ($label) {
            return '<a href="'.$url.'">'.$label.'</a>';
        }

        return '<em>'.__('unsaved').'</em>';
    }
}
