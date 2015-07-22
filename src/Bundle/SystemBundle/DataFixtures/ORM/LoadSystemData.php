<?php

namespace Drafterbit\Bundle\SystemBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drafterbit\Bundle\SystemBundle\Entity\System;

class LoadSystemData extends AbstractFixture implements ContainerAwareInterface
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
        $initData = [
            'sitename' => 'My Awesome Website',
            'frontpage' => 'blog'
        ];
        $this->container->get('system')->update($initData);
    }
}