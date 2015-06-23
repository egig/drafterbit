<?php

namespace Drafterbit\Bundle\BlogBundle\Dashboard;

use Drafterbit\System\Dashboard\Panel;

class RecentCommentPanel extends Panel {

    public function getView()
    {
        $em = $this->container->get('doctrine')->getManager();
        $comments = $em->getRepository('DrafterbitBlogBundle:Comment')
            ->createQueryBuilder('c')
            ->OrderBy('c.createdAt', 'desc')
            ->setMaxResults(5)
            ->getQuery()
            ->getResult();

        return $this->renderView('DrafterbitBlogBundle:Panel:recent_comment.html.twig', [
            'comments' => $comments
        ]);
    }

    public function getName()
    {
        return 'recent_comment';
    }
}