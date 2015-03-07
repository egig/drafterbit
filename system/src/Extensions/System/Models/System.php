<?php namespace Drafterbit\Extensions\System\Models;

class System extends \Drafterbit\Base\Model
{
    private $data = array();

    /**
     * Get system config from database or cache
     *
     * @return array
     */
    public function all()
    {
        if($this->data) {
            return $this->data;
        }

        $queryBuilder = $this['db']->createQueryBuilder();

        $sets = $queryBuilder
            ->select('st.*')
            ->from('#_system', 'st')
            ->getResult();

        $array = [];
        foreach ($sets as $set) {
            $array[$set['name']] = $set['value'];
        }

        return $this->data = $array;
    }

    /**
     * Get system setting by key
     */
    public function get($key, $default = null)
    {
        $config = $this->all();

        return isset($config[$key]) ? $config[$key] : $default;
    }

    public function exists($key)
    {
        $qb = $this['db']->createQueryBuilder();
        $qb->select('*');
        $qb->from('#_system', 'st');
        $qb->where('name=:key');
        $qb->setParameter('key', $key);
        return $qb->execute()->fetch();
    }

    public function updateSetting($data)
    {
        foreach ($data as $key => $value) {
            if ($this->exists($key)) {
                $qb = $this['db']->createQueryBuilder();
                $qb->update('#_system', 'st');
                $qb->set('value', ':value');
                $qb->where('name=:key');
                $qb->setParameter(':key', $key);
                $qb->setParameter(':value', $value);
                $qb->execute();
            } else {
                $this['db']->insert('#_system', ['name' => $key, 'value' => $value]);
            }
        }
    }

    public function updateTheme($theme)
    {
        return $this->updateSetting(['theme' => $theme]);
    }

     /**
     * Return widget ui based on given position
     *
     * @param  string $position
     * @return string
     */
    public function widget($position, $titleTemplate = '{{ title }}', $contentTemplate = "{{ content }}")
    {
        $qb = $this['db']->createQueryBuilder();
        
        $theme = $this['themes']->current();

        $widgets = $qb->select('*')
            ->from('#_widgets', 'w')
            ->where('position=:position')
            ->andWhere('theme=:theme')
            ->setParameter('position', $position)
            ->setParameter('theme', $theme)
            ->execute()->fetchAll();

        usort(
            $widgets,
            function($a, $b) {
                if ($a['sequence'] == $b['sequence']) {
                    return $a['id'] - $b['id'];
                }

                return $a['sequence'] < $b['sequence'] ? -1 : 1;
            }
        );

        $output = null;
        foreach ($widgets as $widget) {
            $title = '';

            if($widget['title']) {
                $title = $this['twig']->render($titleTemplate, $widget);
            }

            $content = $this['widget']->get($widget['name'])->run(json_decode($widget['context'], true));
            $content = $this['twig']->render($contentTemplate, ['content' => $content]);

            $output .= $title.$content;
        }

        return $output;
    }

    /**
     * Return front end menus on given position
     *
     * @param  string $position
     * @return string
     */
    public function menus($position, $parent = 0)
    {
        $theme = $this['themes']->current();
        $menus = $this->getExtension('system')
            ->model('System')->get('theme.'.$theme.'.menus');

        $menus = json_decode($menus, true);

        $id = $menus[$position];

        $items = $this->_getMenuItems($id, $parent);

        foreach ($items as &$item) {
            if ($item['type'] == 1) {
                $item['link'] = strtr($item['link'], ["%base_url%" => base_url()]);
            } elseif ($item['type'] == 2) {
                $pages = $this['app']->getFrontpage();
                $item['link'] = base_url($pages[$item['page']]['defaults']['slug']);
            }

            $item['child'] = null;
            if($this->_menuHasChild($item['id'], $item['menu_id'])) {
                $item['child'] = $this->menus($position, $item['id']);
            }
            
            $item['active'] = (current_url() == $item['link']) ? 'active' : '';
        }

        $data['items'] = $items;

        return $this['twig']->render('nav/main.html', $data);
    }

    public function _getMenuItems($menu_id, $parent = 0)
    {
        $q = $this['db']->createQueryBuilder();
        $q->select('mi.*');
        $q->from('#_menu_items', 'mi');
        $q->where('mi.menu_id=:menu_id');
        $q->andWhere('mi.parent_id=:parent_id');
        $q->setParameter('menu_id', $menu_id);
        $q->setParameter('parent_id', $parent);

        return $q->getResult();
    }

    private function _menuHasChild($id, $menu_id)
    {
        $q = $this['db']->createQueryBuilder();
        $q->select('mi.*');
        $q->from('#_menu_items', 'mi');
        $q->where('mi.menu_id=:menu_id');
        $q->andWhere('mi.parent_id=:parent_id');
        $q->setParameter('menu_id', $menu_id);
        $q->setParameter('parent_id', $id);

        return count($q->getResult()) > 0;
    }
}