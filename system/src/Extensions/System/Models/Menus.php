<?php namespace Drafterbit\Extensions\System\Models;

use Drafterbit\Base\Model;

class Menus extends Model
{
    public function all()
    {
        $menus = $this->withQueryBuilder()
            ->select('*')
            ->from('#_menus', 'w')
            ->getResult();

        return $menus;   
    }

    public function addItem($menuId)
    {
        $data = [
            'label' => 'New Menu Item',
            'menu_id' => $menuId,
            'parent_id' => 0,
            'link' => '#',
        ];

        $this['db']->insert('#_menu_items', $data);
        $data['id'] = $this['db']->lastInsertId();

        return $data;
    }

    public function getItems($id, $parent = 0)
    {
        $items = $this->withQueryBuilder()
            ->select('mi.*')
            ->from('#_menu_items', 'mi')
            ->leftJOin('mi', '#_menus', 'm', 'm.id = mi.menu_id')
            ->where('mi.parent_id=:parent')
            ->andWhere('mi.menu_id=:id')
            ->setParameter('parent', $parent)
            ->setParameter('id', $id)
            ->getResult();

        foreach ($items as &$item) {
            $item['childs'] = $this->hasChild($item['id']) ?
                $this->getItems($id, $item['id']) : [];
        }

        return $items;
    }

    public function hasChild($id)
    {
        $childs = $this->withQueryBuilder()
            ->select('*')
            ->from('#_menu_items', 'mi')
            ->where('mi.parent_id=:parent')
            ->setParameter('parent', $id)
            ->getResult();

        return count($childs) > 0; 
    }

    public function getByThemePosition($theme, $position)
    {
        $menus = $this->withQueryBuilder()
            ->select('*')
            ->from('#_menus', 'w')
            ->where('position=:position')
            ->andWhere('theme=:theme')
            ->setParameter('position', $position)
            ->setParameter('theme', $theme)
            ->getResult();

        return $menus;
    }

    public function save($id, $data)
    {
        if ($this->exists($id)) {
            return $this->update($id, $data);
        } else {
            return $this->insert($data);
        }
    }

    /**
     * Check if a menu is exists
     */
    public function exists($id)
    {
        return (bool)
        $this->withQueryBuilder()
            ->select('*')
            ->from('#_menu_items', 'm')
            ->where("id = $id")
            ->getResult();
    }

    public function update($id, $data)
    {
        $this['db']->update('#_menu_items', $data, ['id' => $id]);
        return $id;
    }

    public function insert($data)
    {
        $this['db']->insert('#_menu_items', $data);
        return $this['db']->lastInsertId();
    }

    public function itemDelete($id)
    {
        return
        $this->withQueryBuilder()
        ->where('id = :id')
        ->orWhere('parent_id = :parent')
        ->setParameter('id', $id)
        ->setParameter('parent', $id)
        ->delete('#_menu_items')->execute();
    }

    public function delete($id)
    {
        $this['db']->delete('#_menu_items', ['menu_id' => $id]);
        $this['db']->delete('#_menus', ['id' => $id]);
    }
}