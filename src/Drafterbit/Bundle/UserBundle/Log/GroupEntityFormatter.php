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
        $em = $this->getKernel()->getContainer()->get('doctrine')->getManager();
        $group = $em->getRepository('DrafterbitUserBundle:Group')->find($id);

        if($group) {
            $label = $group->getName();
        } else {
            $label = "with id $id(deleted)";
        }

        $url = $this->getKernel()
            ->getContainer()
            ->get('router')
            ->generate('drafterbit_user_group_edit', ['id' => $id]);

        if($label) {
            return '<a href="'.$url.'">'.$label.'</a>';
        }

        return '<em>'.__('unsaved').'</em>';
    }
}