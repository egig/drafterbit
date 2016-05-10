<?php

namespace drafterbit\Bundle\CoreBundle\Twig\Extension;

use Symfony\Component\HttpKernel\Kernel;

class FrontendExtension extends \Twig_Extension
{
    protected $container;

    public function __construct(Kernel $kernel)
    {
        $this->container = $kernel->getContainer();

        $em = $this->container->get('doctrine')->getManager();
        $this->menuItemTable = $em->getClassMetadata('CoreBundle:MenuItem')->getTableName();
        $this->widgetTable = $em->getClassMetadata('CoreBundle:Widget')->getTableName();
    }

    public function getFunctions()
    {
        return array(
            new \Twig_SimpleFunction('theme_url', array($this, 'themeUrl')),
            new \Twig_SimpleFunction('base_url', array($this, 'baseUrl')),
            new \Twig_SimpleFunction('menu', array($this, 'menu')),
            new \Twig_SimpleFunction('widget', array($this, 'widget')),
        );
    }

    /**
     * Return front end menus on given position.
     *
     * @param string $position
     *
     * @return string
     *
     * @todo clean this
     */
    public function menu($position, $parent = null)
    {
        $theme = $this->container->get('system')->get('theme.active');

        $menus = $this->container->get('system')->get('theme.'.$theme.'.menu');

        $menus = json_decode($menus, true);

        $id = $menus[$position];

        $items = $this->_getMenuItems($id, $parent);
        $request = $this->container->get('request_stack')->getCurrentRequest();
        $baseUrl = $request->getUriForPath('');
        foreach ($items as &$item) {

            // Replace %base_url with current site $baseUrl
            // this allows user to uses %base_url% in menu item link
            $item['link'] = strtr($item['link'], ['%base_url%' => $baseUrl]);

            $item['child'] = null;
            if ($this->_menuHasChild($item['id'], $item['menu_id'])) {
                $item['child'] = $this->menu($position, $item['id']);
            }

            // @todo
            $item['active'] = '';//(current_url() == $item['link']) ? 'active' : '';
        }

        $data['items'] = $items;

        return $this->container->get('templating')->render('nav/main.html.twig', $data);
    }

    public function _getMenuItems($menu_id, $parent = null)
    {
        $q = $this->container->get('database_connection')->createQueryBuilder();
        $q->select('mi.*');
        $q->from($this->menuItemTable, 'mi');
        $q->where('mi.menu_id=:menu_id');
        $q->setParameter('menu_id', $menu_id);

        if (is_null($parent)) {
            $q->andWhere('mi.parent_id is NULL');
        } else {
            $q->andWhere('mi.parent_id=:parent_id');
            $q->setParameter('parent_id', $parent);
        }

        return $q->execute()->fetchAll();
    }

    private function _menuHasChild($id, $menu_id)
    {
        $q = $this->container->get('database_connection')->createQueryBuilder();
        $q->select('mi.*');
        $q->from($this->menuItemTable, 'mi');
        $q->where('mi.menu_id=:menu_id');
        $q->andWhere('mi.parent_id=:parent_id');
        $q->setParameter('menu_id', $menu_id);
        $q->setParameter('parent_id', $id);

        return count($q->execute()->fetchAll()) > 0;
    }

    public function themeUrl($path)
    {
        $path = trim($path, '/');
        $theme = $this->container->get('system')->get('theme.active');
        $path = 'themes/'.$theme.'/'.$path;
        $request = $this->container->get('request_stack')->getCurrentRequest();

        return $request->getSchemeAndHttpHost().$request->getBasePath().'/'.$path;
    }

    public function baseUrl($path = null, $param = [])
    {
        $path = trim($path, '/');

        $qs = null;
        if ($param) {
            $qs = '?'.http_build_query($param);
        }

        $request = $this->container->get('request_stack')->getCurrentRequest();

        return $request->getUriForPath('/'.$path.$qs);
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'dt_system.frontend';
    }

    /**
     * Widget template helper.
     *
     * @todo clean this
     */
    public function widget($position, $titleTemplate = '{{ title }}', $contentTemplate = '{{ content }}')
    {
        $qb = $this->container->get('database_connection')->createQueryBuilder();

        $theme = $this->container->get('system')->get('theme.active');

        $widgets = $qb->select('*')
            ->from($this->widgetTable, 'w')
            ->where('position=:position')
            ->andWhere('theme=:theme')
            ->setParameter('position', $position)
            ->setParameter('theme', $theme)
            ->execute()->fetchAll();

        usort(
            $widgets,
            function ($a, $b) {
                if ($a['sequence'] == $b['sequence']) {
                    return $b['id'] - $a['id'];
                }

                return $a['sequence'] < $b['sequence'] ? -1 : 1;
            }
        );

        $output = null;

        foreach ($widgets as $widget) {
            $context = json_decode($widget['context'], true);

            $title = '';

            if (!empty($context['title'])) {
                $title = strtr($titleTemplate, ['{{ title }}' => $context['title']]);
            }

            $content = $this->container->get('dt_system.widget.manager')->get($widget['name'])->run($context);
            $content = strtr($contentTemplate, ['{{ content }}' => $content]);

            $output .= $title.$content;
        }

        return $output;
    }
}
