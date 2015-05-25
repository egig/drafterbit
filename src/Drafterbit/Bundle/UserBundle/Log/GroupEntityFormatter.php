<?php

namespace Drafterbit\Bundle\UserBundle\Log;

use Drafterbit\Bundle\SystemBundle\Log\BaseEntityFormatter;

class GroupEntityFormatter extends BaseEntityFormatter
{
	public function getName()
	{
		return 'group';
	}

	public function format($id)
	{
		if ($this->getUser()->getId() == $id) {

            $label = 'You';
        } else {

        	$em = $this->getKernel()->getContainer()->get('doctrine')->getManager();
        	$group = $em->getRepository('DrafterbitUserBundle:Group')->find($id);

            $label = $group->getName();
        }

        $url = $this->getKernel()
            ->getContainer()
            ->get('router')
            ->generate('drafterbit_user_edit', ['id' => $id]);

        if($label) {
            return '<a href="'.$url.'">'.$label.'</a>';
        }

        return '<em>'.__('unsaved').'</em>';
	}
}