<?php

namespace Drafterbit\Bundle\UserBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Drafterbit\Bundle\UserBundle\Entity\User;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class LoadUserData extends AbstractFixture implements OrderedFixtureInterface, ContainerAwareInterface
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
     */
    public function load(ObjectManager $manager)
    {
        $data = $this->container->get('drafterbit_installer')->getData();

        $username = isset($data['username']) ? $data['username'] : 'admin';
        $email = isset($data['email']) ? $data['email'] : 'admin@drafterbit.org';
        $password = isset($data['password']) ? $data['password'] : 'admin';

        $userAdmin = new User();
        $userAdmin->setUsername($username);
        $userAdmin->setEmail($email);
        $userAdmin->setPlainPassword($password);
        $userAdmin->setEnabled(1);
        $userAdmin->addRole('ROLE_ADMIN');

        $userAdmin->getGroups()->add($this->getReference('admin-group'));

        $manager->persist($userAdmin);
        $manager->flush();

        $this->addReference('admin-user', $userAdmin);
    }

    /**
     * {@inheritDoc}
     */
    public function getOrder()
    {
        return 2;
    }
}