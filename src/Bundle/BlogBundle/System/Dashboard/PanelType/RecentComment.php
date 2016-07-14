<?php

namespace drafterbit\Bundle\BlogBundle\System\Dashboard\PanelType;

use drafterbit\Core\Dashboard\PanelType;

class RecentComment extends PanelType
{
    public function getView()
    {
        $em = $this->container->get('doctrine')->getManager();
        $comments = $em->getRepository('BlogBundle:Comment')
            ->createQueryBuilder('c')
            ->OrderBy('c.createdAt', 'desc')
            ->setMaxResults(5)
            ->getQuery()
            ->getResult();

        return $this->renderView('BlogBundle:Panel:recent_comment.html.twig', [
            'comments' => $comments,
        ]);
    }

    public function getName()
    {
        return 'RecentComment';
    }
}
