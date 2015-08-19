<?php

namespace Drafterbit\Bundle\SystemBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drafterbit\Bundle\SystemBundle\Entity\Menu;
use Drafterbit\Bundle\SystemBundle\Entity\MenuItem;

class LoadMenuData extends AbstractFixture implements OrderedFixtureInterface
{
    /**
     * {@inheritDoc}
     * @todo get user email during install
     */
    public function load(ObjectManager $manager)
    {
        $menu = new Menu();
        $menu->setDisplayText('main');
        $manager->persist($menu);

        $home = new MenuItem;
        $home->setDisplayText('Home');
        $home->setLink('%base_url%');
        $home->setMenu($menu);
        $home->setSequence(0);
        $manager->persist($home);

        // @todo inject  real page
        $samplePage = new MenuItem;
        $samplePage->setDisplayText($this->getReference('sample-page')->getTitle());
        $samplePage->setLink('%base_url%/'.$this->getReference('sample-page')->getSlug());
        $samplePage->setMenu($menu);
        $samplePage->setSequence(0);
        $manager->persist($samplePage);

        $manager->flush();

        $this->addReference('main-menu', $menu);
    }

    /**
     * {@inheritDoc}
     */
    public function getOrder()
    {
        return 4;
    }
}