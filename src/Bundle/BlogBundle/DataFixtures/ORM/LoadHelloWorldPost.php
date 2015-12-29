<?php

namespace Drafterbit\Bundle\BlogBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Drafterbit\Bundle\BlogBundle\Entity\Post;
use Drafterbit\Bundle\BlogBundle\Entity\Category;
use Drafterbit\Bundle\BlogBundle\Entity\Tag;
use Drafterbit\Bundle\BlogBundle\Entity\Comment;

class LoadHelloWorldPost extends AbstractFixture implements OrderedFixtureInterface
{
    /**
     * {@inheritDoc}
     */
    public function load(ObjectManager $manager)
    {
        $tag = new Tag;
        $tag->setSlug('test tag');
        $tag->setLabel('Test Tag');
        $manager->persist($tag);

        $category = new Category;
        $category->setSlug('uncategorized');
        $category->setLabel('Uncategorized');
        $manager->persist($category);

        $manager->flush();

        $post = new Post();
        $post->setSlug('hello-world');
        $post->setTitle('Hello World');
        $post->setContent('This is hello world to be edited or removed');
        $post->setUser($this->getReference('admin-user'));
        $post->setCreatedAt(new \DateTime);
        $post->setUpdatedAt(new \DateTime);
        $post->setPublishedAt(new \DateTime);
        $post->setStatus(1);
        $post->setType(POST::TYPE_STANDARD);

        $tags = $manager->getRepository('BlogBundle:Tag')->findBy(['label' => $tag->getLabel()]);
        $post->setTags($tags);

        $categories = $manager->getRepository('BlogBundle:Category')->findBy(['label' => $category->getLabel()]);
        $post->setCategories($categories);

        $manager->persist($post);

        $author = $this->getReference('admin-user');

        $comment = new Comment;
        $comment->setAuthorName($author->getRealName());
        $comment->setAuthorEmail($author->getEmail());
        $comment->setAuthorUrl($author->getUrl());
        $comment->setContent('This is test comment.');
        $comment->setPost($post);
        $comment->setCreatedAt(new \DateTime);
        $comment->setUpdatedAt(new \DateTime);
        $comment->setDeletedAt(NULL);
        $comment->setStatus(Comment::STATUS_APPROVED);
        $comment->setSubscribe(0);

        $manager->persist($comment);

        $manager->flush();
    }

    /**
     * {@inheritDoc}
     */
    public function getOrder()
    {
        return 6;
    }
}