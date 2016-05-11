<?php

namespace drafterbit\Bundle\CoreBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use drafterbit\Bundle\CoreBundle\Entity\Menu;
use drafterbit\Bundle\CoreBundle\Entity\MenuItem;

class LoadMenuData extends AbstractFixture implements OrderedFixtureInterface
{
    /**
     * {@inheritdoc}
     */
    public function load(ObjectManager $manager)
    {
        $menu = new Menu();
        $menu->setDisplayText('main');
        $manager->persist($menu);

        $home = new MenuItem();
        $home->setDisplayText('Home');
        $home->setLink('%base_url%');
        $home->setMenu($menu);
        $home->setSequence(0);
        $manager->persist($home);

        $samplePage = new MenuItem();
        $samplePage->setDisplayText($this->getReference('sample-page')->getTitle());
        $samplePage->setLink('%base_url%/'.$this->getReference('sample-page')->getSlug());
        $samplePage->setMenu($menu);
        $samplePage->setSequence(0);
        $manager->persist($samplePage);

        $manager->flush();

        $this->addReference('main-menu', $menu);
    }

    /**
     * {@inheritdoc}
     */
    public function getOrder()
    {
        return 4;
    }
}
