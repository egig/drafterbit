<?php namespace Drafterbit\Component\Database;

use Doctrine\DBAL\Driver;
use Doctrine\DBAL\Configuration;
use Doctrine\Common\EventManager;
use Doctrine\DBAL\Cache\QueryCacheProfile;
use Doctrine\DBAL\Connection as BaseConnection;
use Drafterbit\Component\Cache\CacheManager;

class Connection extends BaseConnection
{
    const SINGLE_QUOTED_TEXT = '\'([^\'\\\\]*(?:\\\\.[^\'\\\\]*)*)\'';
    const DOUBLE_QUOTED_TEXT = '"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"';

    /**
     * The table prefix.
     *
     * @var string
     */
    protected $prefix;

    /**
     * The table prefix placeholder.
     *
     * @var string
     */
    protected $placeholder = '#_';

    /**
     * The regex for parsing SQL query parts.
     *
     * @var array
     */
    protected $regex = [];

    /**
     * Debug
     *
     * @var boolean
     */
    protected $debug = true;

    /**
     * Whether the connection is caching
     *
     * @var boolean
     */
    protected $caching = false;

    /**
     * Cache directory
     *
     * @var string
     */
    protected $cacheDir;

    /**
     * Cache manager
     *
     * @var Drafterbit\Component\Cache\CacheManager
     */

    /**
     * Initializes a new instance of the Connection class.
     *
     * @param array         $params
     * @param Driver        $driver
     * @param Configuration $config
     * @param EventManager  $eventManager
     */
    public function __construct(
        array $params,
        Driver $driver,
        Configuration $config = null,
        EventManager $eventManager = null,
        CacheManager $cacheManager = null)
    {
        parent::__construct($params, $driver, $config, $eventManager);

        if (isset($params['prefix'])) {
            $this->prefix = $params['prefix'];
        }

        if(isset($params['debug'])) {
            $this->debug = $params['debug'];
        }

        if(isset($params['cache_dir'])) {
            $this->cacheDir = $params['cache_dir'];
        }

        $this->cacheManager = $cacheManager;

        $this->regex['quotes'] = "/([^'\"]+)(?:".self::DOUBLE_QUOTED_TEXT."|".self::SINGLE_QUOTED_TEXT.")?/As";
        $this->regex['placeholder'] = "/".preg_quote($this->placeholder)."([a-zA-Z_][a-zA-Z0-9_]*)/";
    }

    /**
     * Gets the table prefix.
     *
     * @return string
     */
    public function getPrefix()
    {
        return $this->prefix;
    }

    /**
     * Replaces the table prefix placeholder with actual one.
     *
     * @param  string $query
     * @return string
     */
    public function replacePrefix($query)
    {
        foreach ($this->getUnquotedQueryParts($query) as $part) {

            if (strpos($part[0], $this->placeholder) === false) {
                continue;
            }

            $replace = preg_replace($this->regex['placeholder'], $this->prefix.'$1', $part[0], -1, $count);

            if ($count) {
                $query = substr_replace($query, $replace, $part[1], strlen($part[0]));
            }
        }

        return $query;
    }

    /**
     * {@inheritdoc}
     */
    public function fetchAll($sql, array $params = [], $types = [])
    {
        $stmt = $this->executeQuery($sql, $params, $types);
        
        $result = $stmt->fetchAll();
        
        // caching
        $stmt->closeCursor();

        return $result;
    }

    /**
     * {@inheritdoc}
     */
    public function fetchAssoc($statement, array $params = [], array $types = [])
    {
        $stmt = $this->executeQuery($statement, $params, $types);

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // caching
        $stmt->closeCursor();

        return $result;
    }

    /**
     * {@inheritdoc}
     */
    public function fetchArray($statement, array $params = [], array $types = [])
    {
        $stmt = $this->executeQuery($statement, $params, $types);

        $result = $stmt->fetch(PDO::FETCH_NUM);

        // caching
        $stmt->closeCursor();

        return $result;
    }

    /**
     * {@inheritdoc}
     */
    public function fetchColumn($statement, array $params = [], $colnum = 0, array $types = [])
    {
        $stmt =  $this->executeQuery($statement, $params);

        $result = $stmt->fetchColumn($colnum);

        // caching
        $stmt->closeCursor();

        return $result;
    }

    /**
     * @{inheritdoc}
     */
    public function prepare($query)
    {
        return parent::prepare($this->replacePrefix($query));
    }

    /**
     * @{inheritdoc}
     */
    public function exec($query)
    {
        return parent::exec($this->replacePrefix($query));
    }

    /**
     * @{inheritdoc}
     */
    public function executeQuery($query, array $params = [], $types = [], QueryCacheProfile $qcp = null)
    {
        // if caching is running, or debug set tu true, we'll not create a cache profile
        if($this->caching or $this->debug) {
            $qcp = null;
        } else {
            $resultCacheDriver = $this->cacheManager->driver();
            $qcp = new QueryCacheProfile(0, null, $resultCacheDriver);
        }

        $stmt = parent::executeQuery($this->replacePrefix($query), $params, $types, $qcp);

        return $stmt;
    }

    /**
     * {@inheritdoc}
     */
    public function executeCacheQuery($query, $params, $types, QueryCacheProfile $qcp)
    {
        $this->caching = true;
        $stmt = parent::executeCacheQuery($this->replacePrefix($query), $params, $types, $qcp);

        $this->caching = false;
        return $stmt;
    }

    /**
     * @{inheritdoc}
     */
    public function executeUpdate($query, array $params = [], array $types = [])
    {
        $result = parent::executeUpdate($this->replacePrefix($query), $params, $types);

        $this->clearCache();

        return $result;
    }

    /**
     * Parses the unquoted SQL query parts.
     *
     * @param  string $query
     * @return array
     */
    protected function getUnquotedQueryParts($query)
    {
        preg_match_all($this->regex['quotes'], $query, $parts, PREG_OFFSET_CAPTURE);

        return $parts[1];
    }

    /**
     * {@inheritdoc}
     */
    public function createQueryBuilder()
    {
        return new Query\QueryBuilder($this);
    }

    /**
     * Database server version
     *
     * @return string
     */
    public function getServerVersion()
    {
        $driver = $this->getDriver()->getName();
        switch ($driver) {
            case 'pdo_mysql':
            return 'MySql '.$this->getWrappedConnection()->getAttribute(\PDO::ATTR_SERVER_VERSION);
                break;          
            default:
                break;
        }
        
        return 'Unknown database server';
    }

    /**
     * Get debug
     *
     * @return boolean
     */
    public function getDebug()
    {
        return $this->debug;
    }

    /**
     * Clear query cache
     *
     * @return void
     */
    public function clearCache()
    {
        if(is_dir($this->cacheDir)) {
            $files = array_diff(scandir($this->cacheDir), ['.', '..']);

            $size = 0;
            foreach ($files as $file) {
                $this->cacheManager->delete($file);
            }
        }
    }
}