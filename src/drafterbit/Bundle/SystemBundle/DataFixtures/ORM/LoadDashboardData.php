<?php

namespace drafterbit\Bundle\SystemBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use drafterbit\Bundle\SystemBundle\Entity\Panel;

class LoadDashboardData extends AbstractFixture implements OrderedFixtureInterface
{
    /**
     * {@inheritdoc}
     *
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
        $shortcut->setTitle('Shortcut');
        $manager->persist($shortcut);

        $recentComment = new Panel();
        $recentComment->setPosition('left');
        $recentComment->setSequence(1);
        $recentComment->setType('RecentComment');
        $recentComment->setUser($this->getReference('admin-user'));
        $recentComment->setStatus(1);
        $recentComment->setTitle('Recent Comment');
        $manager->persist($recentComment);

        $info = new Panel();
        $info->setPosition('right');
        $info->setSequence(0);
        $info->setType('Info');
        $info->setUser($this->getReference('admin-user'));
        $info->setStatus(1);
        $info->setTitle('Info');
        $manager->persist($info);

        $log = new Panel();
        $log->setPosition('right');
        $log->setSequence(1);
        $log->setType('Log');
        $log->setUser($this->getReference('admin-user'));
        $log->setStatus(1);
        $log->setTitle('Recent Activity');
        $log->setContext(json_encode(['num' => 10]));
        $manager->persist($log);

        $manager->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function getOrder()
    {
        return 8;
    }
}
