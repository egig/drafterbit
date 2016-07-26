<?php

namespace drafterbit\Bundle\CoreBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use drafterbit\Bundle\CoreBundle\Entity\Panel;

class LoadDashboardData extends AbstractFixture implements OrderedFixtureInterface
{
    /**
     * {@inheritdoc}
     *
     * @todo get user email during install
     */
    public function load(ObjectManager $manager)
    {
        $info = new Panel();
        $info->setPosition('right');
        $info->setSequence(0);
        $info->setType('Info');
        $info->setUser($this->getReference('admin-user'));
        $info->setStatus(1);
        $info->setTitle('Info');
        $manager->persist($info);

        $log = new Panel();
        $log->setPosition('left');
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
