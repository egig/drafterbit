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

            $label = $user->getRealname();
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

    public function getUser()
    {
        $container = $this->kernel->getContainer();

        if (!$container->has('security.token_storage')) {
            throw new \LogicException('The SecurityBundle is not registered in your application.');
        }

        if (null === $token = $container->get('security.token_storage')->getToken()) {
            return;
        }

        if (!is_object($user = $token->getUser())) {
            // e.g. anonymous authentication
            return;
        }

        return $user;
    }
}