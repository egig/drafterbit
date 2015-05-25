<?php namespace Drafterbit\Extensions\System\Widgets;

use Drafterbit\Base\Widget\Widget;

class MenuWidget extends Widget
{
    public function getName()
    {
        return 'menu';
    }

    public function run($context = null)
    {
        if(!isset($context['menu'])) {
            return null;
        }
        
        $items = $this->model('@system\Menus')->getItems($context['menu']);

        return $this->renderItems($items);
    }

    private function renderItems($items)
    {
        foreach ($items as &$item) {
            if ($item['type'] == 1) {
                $item['link'] = strtr($item['link'], ["%base_url%" => base_url()]);
            } elseif ($item['type'] == 2) {
                $pages = $this['extension']->data('frontpage');
                $item['link'] = base_url($pages[$item['page']]['defaults']['slug']);
            }

            $item['childs'] = null;
            if($this->_menuHasChild($item['id'], $item['menu_id'])) {
                $childs = $this->model('@system\Menus')->getItems($item['menu_id'], $item['id']);
                $item['childs'] = $this->renderItems($childs);
            }
            
            $item['active'] = (current_url() == $item['link']) ? 'active' : '';
        }

        $data['items'] = $items;

        return $this['twig']->render('widgets/menu.html', $data);
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

    public function getContextTypes()
    {
        $menus = $this->model('@system\Menus')->all();

        $options = [];
        foreach ($menus as $menu) {
            $options[$menu['id']] = $menu['name'];
        }

        return [
            ['name' =>'menu',
            'label' => 'Menu',
            'type' => 'select',
            'options' => $options,
            'default' => null
            ]
        ];
    }
}