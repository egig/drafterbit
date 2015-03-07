<?php namespace Drafterbit\Component\Database\Schema;

use Doctrine\DBAL\Schema\MySqlSchemaManager as BaseManager;

class MySqlSchemaManager extends BaseManager {
    
    /**
     * {@inheritdoc}
     */
    public function tablesExist($tables)
    {
        $tables = array_map([$this->_conn, 'replacePrefix'], (array)$tables);
        return parent::tablesExist($tables);
    }
}