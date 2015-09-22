<?php

namespace Drafterbit\Bundle\SystemBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drafterbit\Bundle\SystemBundle\Entity\Panel;

class LoadDashboardData extends AbstractFixture implements OrderedFixtureInterface
{
    /**
     * {@inheritDoc}
     * @todo get user email during install
     */
    public function load(ObjectManager $manager)
    {
        $shortcut = new Panel();
        $shortcut->setPosition('left');
        $shortcut->setSequence(0);
        $shortcut->setType('Shortcut');
        $shortcut->setUser($this->getReference('admin-user'));
        $shortcut->setStatus(1);
        $shortcut->setContext(json_encode(['title' => 'Shortcut']));
        $manager->persist($shortcut);

        $recentComment = new Panel();
        $recentComment->setPosition('left');
        $recentComment->setSequence(1);
        $recentComment->setType('RecentComment');
        $recentComment->setUser($this->getReference('admin-user'));
        $recentComment->setStatus(1);
        $recentComment->setContext(json_encode(['title' => 'Recent Comment']));
        $manager->persist($recentComment);

        $info = new Panel();
        $info->setPosition('right');
        $info->setSequence(0);
        $info->setType('Info');
        $info->setUser($this->getReference('admin-user'));
        $info->setStatus(1);
        $info->setContext(json_encode(['title' => 'Info']));
        $manager->persist($info);

        $log = new Panel();
        $log->setPosition('left');
        $log->setSequence(1);
        $log->setType('Log');
        $log->setUser($this->getReference('admin-user'));
        $log->setStatus(1);
        $log->setContext(json_encode(['title' => 'Recent Activity']));
        $manager->persist($log);

        $manager->flush();
    }

    /**
     * {@inheritDoc}
     */
    public function getOrder()
    {
        return 8;
    }
}