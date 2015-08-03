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
     * @todo get user email during install
     */
    public function load(ObjectManager $manager)
    {
        $initData = [
            'system.site_name' => 'My Awesome Website',
            'system.site_description' => 'Just an Awesome DrafTerbit Website',
            'system.frontpage' => 'blog',
            'system.date_format' => 'd m Y',
            'system.time_format' => 'H:i'
        ];

        if($this->container->has('installer')) {
            $connection = $this->container->get('installer')->getConnection();
            
            $this->container->get('system')->setConnection($connection);
        }

        $this->container->get('system')->update($initData);
    }
}
