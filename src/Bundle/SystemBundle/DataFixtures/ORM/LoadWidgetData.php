<?php

namespace Drafterbit\Bundle\SystemBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drafterbit\Bundle\SystemBundle\Entity\Widget;

class LoadWidgetData extends AbstractFixture implements  ContainerAwareInterface, OrderedFixtureInterface
{
    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * {@inheritDoc}
     */
    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }
    
    /**
     * {@inheritDoc}
     * @todo get user email during install
     */
    public function load(ObjectManager $manager)
    {
        $theme = $this->container->getParameter('theme');

        $search = new Widget;
        $search->setName('search');
        $search->setTheme($theme);
        $search->setPosition('Sidebar');
        $search->setSequence(0);
        $search->setContext(json_encode(['title' => 'Search']));

        $manager->persist($search);

        $meta = new Widget;
        $meta->setName('meta');
        $meta->setTheme($theme);
        $meta->setPosition('Sidebar');
        $meta->setSequence(1);
        $meta->setContext(json_encode(['title' => 'Meta']));

        $manager->persist($meta);

        $manager->flush();
    }

    /**
     * {@inheritDoc}
     */
    public function getOrder()
    {
        return 7;
    }
}