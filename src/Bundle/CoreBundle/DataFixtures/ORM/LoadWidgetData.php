<?php

namespace drafterbit\Bundle\CoreBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use drafterbit\Bundle\CoreBundle\Entity\Widget;

class LoadWidgetData extends AbstractFixture implements  ContainerAwareInterface, OrderedFixtureInterface
{
    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * {@inheritdoc}
     */
    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    /**
     * {@inheritdoc}
     *
     * @todo get user email during install
     */
    public function load(ObjectManager $manager)
    {
        // @todo create global accesible constant for default thme
        $theme = 'feather';

        $search = new Widget();
        $search->setName('search');
        $search->setTheme($theme);
        $search->setPosition('Sidebar');
        $search->setSequence(0);
        $search->setContext(json_encode(['title' => 'Search']));

        $manager->persist($search);

        $meta = new Widget();
        $meta->setName('meta');
        $meta->setTheme($theme);
        $meta->setPosition('Sidebar');
        $meta->setSequence(1);
        $meta->setContext(json_encode(['title' => 'Meta']));

        $manager->persist($meta);

        $manager->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function getOrder()
    {
        return 7;
    }
}
