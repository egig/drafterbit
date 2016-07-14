<?php

namespace drafterbit\Bundle\CoreBundle\System\Log;

use drafterbit\Core\Log\BaseEntityFormatter;

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

            if ($user) {
                $label = $user->getRealname();
            } else {
                $label = "with id $id(deleted)";
            }
        }

        $url = $this->getKernel()
            ->getContainer()
            ->get('router')
            ->generate('dt_user_edit', ['id' => $id]);

        if ($label) {
            return '<a href="'.$url.'">'.$label.'</a>';
        }

        return '<em>'.__('unsaved').'</em>';
    }
}
