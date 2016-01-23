<?php

namespace Drafterbit\Bundle\BlogBundle\Model;

use Doctrine\ORM\EntityManager;
use Drafterbit\Bundle\BlogBundle\Entity\Post;

class Revision
{
    protected $entityManager;
    protected $user;

    public function __construct(EntityManager $entityManager, $user)
    {
        $this->entityManager = $entityManager;
        $this->user = $user;
    }

    /**
     * Create a post revision.
     *
     * @param int    $id
     * @param string $newTitle
     * @param string $newContent
     * @param Post   $new        post object
     * @param bool   $force
     */
    public function create($currentTitle, $currentContent, Post $new, $force = false)
    {
        if (!$force) {
            if ($currentTitle == $new->getTitle() &&
                $currentContent == $new->getContent()) {
                return;
            }
        }

        $em = $this->entityManager;

        //create new
        $post = new Post();
        $post->setTitle($currentTitle);
        $post->setContent($currentContent);
        $post->setType('history:'.$new->getId());
        $post->setSlug($new->getSlug());
        $post->setCreatedAt(new \DateTime());
        $post->setUpdatedAt(new \DateTime());
        $post->setDeletedAt(null);
        $post->setPublishedAt($new->getPublishedAt());
        $post->setStatus($new->getStatus());

        $post->setUser($this->user);

        $em->persist($post);
        $em->flush();
    }
}
