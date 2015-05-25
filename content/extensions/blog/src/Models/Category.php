<?php namespace Drafterbit\Blog\Models;

use Drafterbit\Base\Model;

class Category extends Model
{
    public function all()
    {
        $cats = $query = $this->withQueryBuilder()
            ->select('*')
            ->from('#_categories', 'c')
            ->getResult();

        return $cats;
    }

    public function tree($parent = 0)
    {
        $cats = $query = $this->withQueryBuilder()
            ->select('*')
            ->from('#_categories', 'c')
            ->where('parent_id = :parent_id')
            ->setParameter('parent_id', $parent)
            ->getResult();

        foreach ($cats as &$cat) {
            $cat['childrens'] = $this->tree($cat['id']);
        }

        return $cats;
    }

    public function getOne($id)
    {
        return $query = $this->withQueryBuilder()
            ->select('*')
            ->from('#_categories', 'c')
            ->where("id = '$id'")
            ->execute()->fetch();
    }

    public function getOneBy($key, $value)
    {
        return $query = $this->withQueryBuilder()
            ->select('*')
            ->from('#_categories', 'c')
            ->where("$key = :value")
            ->setParameter('value', $value)
            ->execute()->fetch();
    }

    public function insert($data)
    {
        $this['db']->insert('#_categories', $data);
        return $this['db']->lastInsertId();
    }

    public function update($data, $id)
    {
        $this['db']->update('#_categories', $data, ['id' => $id]);
    }
}