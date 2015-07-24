<?php

namespace Drafterbit\Bundle\SystemBundle\System\Log;

use Drafterbit\System\Log\BaseEntityFormatter;

class AuthorEntityFormatter extends BaseEntityFormatter
{
    public function getName()
    {
        return 'author';
    }

    public function format($id)
    {
        if ($this->getUser()->getId() == $id) {

            $label = $this->getKernel()->getContainer()->get('translator')->trans('You');
        } else {

            $em = $this->getKernel()->getContainer()->get('doctrine')->getManager();
            $user = $em->getRepository('UserBundle:User')->find($id);

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
