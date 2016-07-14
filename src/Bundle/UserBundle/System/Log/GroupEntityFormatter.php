<?php

namespace drafterbit\Bundle\UserBundle\System\Log;

use drafterbit\Core\Log\BaseEntityFormatter;

class GroupEntityFormatter extends BaseEntityFormatter
{
    public function getName()
    {
        return 'group';
    }

    public function format($id)
    {
        $em = $this->getKernel()->getContainer()->get('doctrine')->getManager();
        $group = $em->getRepository('UserBundle:Group')->find($id);

        if ($group) {
            $label = $group->getName();
        } else {
            $label = "with id $id(deleted)";
        }

        $url = $this->getKernel()
            ->getContainer()
            ->get('router')
            ->generate('dt_user_group_edit', ['id' => $id]);

        if ($label) {
            return '<a href="'.$url.'">'.$label.'</a>';
        }

        return '<em>'.__('unsaved').'</em>';
    }
}
