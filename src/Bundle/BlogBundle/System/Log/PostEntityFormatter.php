<?php

namespace drafterbit\Bundle\BlogBundle\System\Log;

use drafterbit\Core\Log\BaseEntityFormatter;

class PostEntityFormatter extends BaseEntityFormatter
{
    public function getName()
    {
        return 'post';
    }

    public function format($id)
    {
        $em = $this->getKernel()->getContainer()->get('doctrine')->getManager();
        $post = $em->getRepository('BlogBundle:Post')->find($id);

        if ($post) {
            $label = $post->getTitle();
        } else {
            $label = "with id $id(deleted)";
        }

        $url = $this->getKernel()
            ->getContainer()
            ->get('router')
            ->generate('dt_blog_post_edit', ['id' => $id]);

        if ($label) {
            return '<a href="'.$url.'">'.$label.'</a>';
        }

        return '<em>'.__('unsaved').'</em>';
    }
}
