<?php namespace Drafterbit\Extensions\System\Models;

use Drafterbit\Framework\Model;

class Widget extends Model
{
    public function widget($position, $theme)
    {
        $qb = $this['db']->createQueryBuilder();
        
        $widgets = $qb->select('*')
            ->from('#_widgets', 'w')
            ->where('position=:position')
            ->andWhere('theme=:theme')
            ->setParameter('position', $position)
            ->setParameter('theme', $theme)
            ->execute()->fetchAll();
        
        foreach ($widgets as &$widget) {
            $widget['context'] = json_decode($widget['context'], true);
        }
        
        return $widgets;
    }

    public function add($name, $pos)
    {
        $theme = $this['themes']->current();

        $this['db']
            ->insert(
                '#_widgets',
                [
                    'name' => $name,
                    'position' =>  $pos,
                    'theme' =>  $theme
                ]
            );

        return $this['db']->lastInsertId();
    }

    public function fetch($id)
    {
        $qb = $this['db']->createQueryBuilder();
        
        $widget = $qb->select('*')
            ->from('#_widgets', 'w')
            ->where('id=:id')
            ->setParameter('id', $id)
            ->execute()->fetchAll();

        return reset($widget);
    }

    public function remove($id)
    {
        return $this['db']->delete("#_widgets", ['id'=> $id]);
    }

    public function save($id, $title, $context, $name = null, $position = null, $theme = null)
    {
        $context =  json_encode($context);

        if ($this->has($id)) {
            $this['db']->update('#_widgets', ['title' => $title, 'context' => $context], ['id' => $id]);
            return $id;
        }

        $data = [
            'position' => $position,
            'title' => $title,
            'context' => $context,
            'name' => $name,
            'position' => $position,
            'theme' => $theme
        ];
        $this['db']->insert('#_widgets', $data);
        return $this['db']->lastInsertId();
    }

    public function has($id)
    {
        return (bool) $this->fetch($id);
    }

    public function update($id, $data)
    {
        return $this['db']->update('#_widgets', $data, ['id' => $id]);
    }
}
