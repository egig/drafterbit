<?php

namespace drafterbit\Bundle\CoreBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use drafterbit\Bundle\CoreBundle\Entity\System;

class LoadSystemData extends AbstractFixture implements ContainerAwareInterface,  OrderedFixtureInterface
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
        $siteName = 'My Awesome Website';
        $siteDescription = 'Just an Awesome DrafTerbit Website';

        if ($this->container->has('installer')) {
            $data = $this->container->get('installer')->get('site');
            if ($data) {
                $siteName = $data['sitename'];
                $siteDescription = $data['sitedesc'];
            }
        }

        // @todo create global accesible constant for default theme
        $theme = 'feather';

        $initData = [
            'system.site_name' => $siteName,
            'system.site_description' => $siteDescription,
            'system.frontpage' => 'sample-page',
            'system.date_format' => 'd m Y',
            'system.time_format' => 'H:i',
            'theme.active' => $theme,
            'theme.'.$theme.'.menu' => '{"main":"'.$this->getReference('main-menu')->getId().'","side":"0"}',
        ];

        $this->container->get('system')->update($initData);
    }

    /**
     * {@inheritdoc}
     */
    public function getOrder()
    {
        return 5;
    }
}
