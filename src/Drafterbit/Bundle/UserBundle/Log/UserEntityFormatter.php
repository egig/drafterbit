<?php

namespace Drafterbit\Bundle\UserBundle\Log;

use Drafterbit\Bundle\SystemBundle\Log\BaseEntityFormatter;

class UserEntityFormatter extends BaseEntityFormatter
{
	public function getName()
	{
		return 'user';
	}

	public function format($id)
	{
		if ($this->getUser()->getId() == $id) {

            $label = 'You';
        } else {

        	$em = $this->getKernel()->getContainer()->get('doctrine')->getManager();
        	$user = $em->getRepository('DrafterbitUserBundle:User')->find($id);

            if($user) {
                $label = $user->getRealname();
            } else {
                $label = "with id $id(deleted)";
            }
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