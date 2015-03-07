<?php namespace Drafterbit\Component\Database\Query;

use Doctrine\DBAL\Query\QueryBuilder as BaseBuilder;

class QueryBuilder extends BaseBuilder {

    /**
     * Fetch result current query
     * @param 
     * @return array
     */
    public function getResult($fetchMode = null)
    {
        $stmt = $this->execute();
        $result = $stmt->fetchAll($fetchMode);
        $stmt->closeCursor();
        return $result;
    }
}