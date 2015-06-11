<?php

namespace Drafterbit\Bundle\PageBundle\Frontpage;

use Drafterbit\Bundle\SystemBundle\Frontpage\Frontpage;
use Symfony\Component\Routing\Route;

class Page extends Frontpage
{
    public function getName()
    {
        return 'page';
    }

    public function resolve($key){

        $_temp = explode(':', $key);
        $slug = end($_temp);

        $defaults = [
            'slug' => $slug,
            '_controller' => 'DrafterbitPageBundle:Frontend:view'
        ];

        return new Route('/', $defaults);
    }

    public function getType() {
        return 'cascade';
    }

    public function getRoute()
    {
        return new Route('/page/{slug}', ['_controller' => 'DrafterbitPageBundle:Frontend:view']);
    }

    public function getLabel()
    {
        return 'Page';
    }

    /**
     * Get options for frontpage
     *
     * @return array
     */
    public function getOptions()
    {
        $repo = $this->container->get('doctrine')
            ->getManager()->getRepository('DrafterbitPageBundle:Page');

        $pages = $repo->findAll();

        $options = [];
        foreach ($pages as $page) {
            $options[$this->getName().':'.$page->getSlug()] = $page->getTitle();
        }

        return $options;
    }
}