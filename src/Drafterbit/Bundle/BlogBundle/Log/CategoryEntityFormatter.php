<?php

namespace Drafterbit\Bundle\BlogBundle\Log;

use Drafterbit\Bundle\SystemBundle\Log\BaseEntityFormatter;

class CategoryEntityFormatter extends BaseEntityFormatter
{
	public function getName()
	{
		return 'category';
	}

	public function format($id)
	{
        $em = $this->getKernel()->getContainer()->get('doctrine')->getManager();
        $cat = $em->getRepository('DrafterbitBlogBundle:Category')->find($id);

        $label = $cat->getLabel();

        $url = $this->getKernel()
            ->getContainer()
            ->get('router')
            ->generate('drafterbit_blog_category_edit', ['id' => $id]);

        if($label) {
            return '<a href="'.$url.'">'.$label.'</a>';
        }

        return '<em>'.__('unsaved').'</em>';
	}
}