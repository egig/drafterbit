<?php

namespace Drafterbit\Bundle\BlogBundle\Log;

use Drafterbit\Bundle\SystemBundle\Log\BaseEntityFormatter;

class PostEntityFormatter extends BaseEntityFormatter
{
	public function getName()
	{
		return 'post';
	}

	public function format($id)
	{
        $em = $this->getKernel()->getContainer()->get('doctrine')->getManager();
        $post = $em->getRepository('DrafterbitBlogBundle:Post')->find($id);

        $label = $post->getTitle();

        $url = $this->getKernel()
            ->getContainer()
            ->get('router')
            ->generate('drafterbit_blog_post_edit', ['id' => $id]);

        if($label) {
            return '<a href="'.$url.'">'.$label.'</a>';
        }

        return '<em>'.__('unsaved').'</em>';
	}
}