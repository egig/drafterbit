<?php

namespace Drafterbit\Bundle\BlogBundle\Model;

use Doctrine\ORM\EntityManager;
use Drafterbit\Bundle\BlogBundle\Entity\Post;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class Revision
{
    protected $controller;

    public function __construct(Controller $controller)
    {
        $this->controller = $controller;
    }

    /**
     * Create a post revision
     *
     * @param int $id
     * @param string $newTitle
     * @param string $newContent
     * @param Post $new post object
     * @param boolean $force
     */
    public function create($currentTitle, $currentContent, Post $new, $force = false)
    {
        if(!$force) {
            if($currentTitle == $new->getTitle() &&
                $currentContent == $new->getContent()) {
                return;
            }
        }

        $em = $this->controller->getDoctrine()->getManager();

        //create new
        $post = new Post();
        $post->setTitle($currentTitle);
        $post->setContent($currentContent);
        $post->setType('history:'.$new->getId());
        $post->setSlug($new->getSlug());
        $post->setCreatedAt(new \DateTime());
        $post->setUpdatedAt(new \DateTime());
        $post->setDeletedAt(new \DateTime('0000-00-00'));
        $post->setPublishedAt($new->getPublishedAt());
        $post->setStatus($new->getStatus());

        $post->setUser($this->controller->getUser());

        $em->persist($post);
        $em->flush();
    }
}