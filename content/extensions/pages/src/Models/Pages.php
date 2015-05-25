<?php namespace Drafterbit\Extensions\Pages\Models;

class Pages extends \Drafterbit\Base\Model
{

    public function all($filters)
    {
        $query = $this->withQueryBuilder()->select('*')->from('#_pages', 'p');

        $status = $filters['status'];

        if ($status == 'trashed') {
            $query->where('p.deleted_at != :deleted_at');
            $query->setParameter(':deleted_at', '0000-00-00 00:00:00');
        } else {
            $query->where('p.deleted_at = :deleted_at');
            $query->setParameter(':deleted_at', '0000-00-00 00:00:00');

            if ($status !== 'all') {
                $query->andWhere('p.status = :status');
                $s = $status == 'published' ? 1 : 0;
                $query->setParameter(':status', $s);
            }
        }

        return $query->getResult();
    }

    public function insert($data)
    {
        $this['db']->insert('#_pages', $data);
        return $this['db']->lastInsertId();
    }

    public function update($data, $id)
    {
        return
        $this['db']->update('#_pages', $data, ['id' => $id]);
    }

    public function getBy($key, $value = null, $singleRequested = false)
    {
        $queryBuilder = $this['db']->createQueryBuilder();
        $stmt = $queryBuilder->select('*')->from('#_pages', 'p');

        if (is_array($key)) {
            foreach ($key as $k => $v) {
                $holder = ":$k";
                $queryBuilder->where("$k = $holder")
                    ->setParameter($holder, $v);
            }
        
        } else {
            $queryBuilder->where("$key = :$key")
                ->setParameter(":$key", $value);
        }

        $pages = $stmt->getResult();

        if ($singleRequested) {
            return reset($pages);
        }

        return $pages;
    }

    public function getSingleBy($key, $value = null)
    {
        return $this->getBy($key, $value, true);
    }

    /**
     * Delete pages permanently
     *
     * @param  array $ids
     * @return void
     */
    public function delete($ids)
    {
        $ids = (array) $ids;
        $ids = array_map(
            function($v){
                return "'$v'";
            },
            $ids
        );
        $idString = implode(',', $ids);

        $this->withQueryBuilder()
            ->delete('#_pages')
            ->where('id IN ('.$idString.')')
            ->execute();
    }

    /**
     * Trash pages by given ids
     *
     * @param  array $ids
     * @return void
     */
    public function trash($ids)
    {
        $ids = array_map(
            function($v){
                return "'$v'";
            },
            $ids
        );
        $idString = implode(',', $ids);
        $deleted_at = new \Carbon\Carbon;

        $this->withQueryBuilder()
            ->update('#_pages', 'p')
            ->set('deleted_at', "'$deleted_at'")
            ->where('p.id IN ('.$idString.')')
            ->execute();
    }

    /**
     * Restore trashed pages
     *
     * @return void
     */
    public function restore($ids)
    {
        $ids = array_map(
            function($v){
                return "'$v'";
            },
            $ids
        );

        $idString = implode(',', $ids);
        $deleted_at = new \Carbon\Carbon;

        $this->withQueryBuilder()
            ->update('#_pages', 'p')
            ->set('deleted_at', "'0000-00-00 00:00:00'")
            ->where('p.id IN ('.$idString.')')
            ->execute();
    }
}
