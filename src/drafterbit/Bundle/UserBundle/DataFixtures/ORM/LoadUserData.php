<?php

namespace drafterbit\Bundle\UserBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use drafterbit\Bundle\UserBundle\Entity\User;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class LoadUserData extends AbstractFixture implements OrderedFixtureInterface, ContainerAwareInterface
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
     */
    public function load(ObjectManager $manager)
    {
        $username = 'admin';
        $email = 'admin@drafterbit.org';
        $password = 'admin';

        if ($this->container->has('installer')) {
            $data = $this->container->get('installer')->get('account');
            if ($data) {
                $username = $data['username'];
                $password = $data['password'];
            }
        }

        $userAdmin = new User();
        $userAdmin->setUsername($username);
        $userAdmin->setRealname($username);
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
     * {@inheritdoc}
     */
    public function getOrder()
    {
        return 2;
    }
}
