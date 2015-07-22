<?php

namespace Drafterbit\Bundle\UserBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Drafterbit\Bundle\UserBundle\Entity\Group;


class LoadGroupData extends AbstractFixture implements OrderedFixtureInterface
{
    /**
     * {@inheritDoc}
     */
    public function load(ObjectManager $manager)
    {
        $groupAdmin = new Group('Administrator');
        $groupAdmin->addRole('ROLE_SUPER_ADMIN');

        $manager->persist($groupAdmin);
        $manager->flush();

        $this->addReference('admin-group', $groupAdmin);
    }

    /**
     * {@inheritDoc}
     */
    public function getOrder()
    {
        return 1;
    }
}