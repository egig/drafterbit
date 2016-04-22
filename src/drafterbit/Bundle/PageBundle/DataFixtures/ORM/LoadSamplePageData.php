<?php

namespace drafterbit\Bundle\PageBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use drafterbit\Bundle\PageBundle\Entity\Page;

class LoadSamplePageData extends AbstractFixture implements OrderedFixtureInterface
{
    /**
     * {@inheritdoc}
     */
    public function load(ObjectManager $manager)
    {
        $page = new Page();
        $page->setSlug('sample-page');
        $page->setTitle('Sample Page');
        $page->setContent('This is sample page to be edited or removed');
        $page->setUser($this->getReference('admin-user'));
        $page->setCreatedAt(new \DateTime());
        $page->setUpdatedAt(new \DateTime());
        $page->setLayout('default.html.twig');
        $page->setStatus(1);

        $manager->persist($page);
        $manager->flush();

        $this->addReference('sample-page', $page);
    }

    /**
     * {@inheritdoc}
     */
    public function getOrder()
    {
        return 3;
    }
}
