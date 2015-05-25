<?php namespace Drafterbit\Extensions\System\Models;

class Log extends \Drafterbit\Base\Model
{
    public function all()
    {
        $queryBuilder = $this['db']->createQueryBuilder();
        $stmt = $queryBuilder
            ->select('l.*')
            ->from('#_logs', 'l')
            ->orderBy('time', 'DESC');
        return $stmt->execute()->fetchAll();
    }

    public function recent()
    {
        $queryBuilder = $this['db']->createQueryBuilder();
        $stmt = $queryBuilder
            ->select('l.*')
            ->from('#_logs', 'l')
            ->orderBy('time', 'DESC')->setMaxResults(5);

        return $stmt->execute()->fetchAll();
    }

    public function delete($id)
    {
        return $this['db']->delete('#_logs', ['id' => $id]);
    }

    public function clear()
    {
        return $this['db']->exec('TRUNCATE TABLE #_logs');
    }
}
