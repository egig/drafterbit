<?php namespace Drafterbit\Component\Database;

use Drafterbit\Component\Cache\CacheManager;
use Doctrine\Common\EventManager;
use Doctrine\DBAL\Configuration;
use Doctrine\DBAL\DBALException;

final class DriverManager {

    /**
     * List of supported drivers and their mappings to the driver classes.
     *
     * To add your own driver use the 'driverClass' parameter to
     * {@link DriverManager::getConnection()}.
     *
     * @var array
     */
     private static $_driverMap = [
            'pdo_mysql'  => 'Drafterbit\Component\Database\Driver\PDOMySql\Driver'

            /*
            Driver below is coming soon ... :(

            'pdo_sqlite' => 'Doctrine\DBAL\Driver\PDOSqlite\Driver',
            'pdo_pgsql'  => 'Doctrine\DBAL\Driver\PDOPgSql\Driver',
            'pdo_oci'    => 'Doctrine\DBAL\Driver\PDOOracle\Driver',
            'oci8'       => 'Doctrine\DBAL\Driver\OCI8\Driver',
            'ibm_db2'    => 'Doctrine\DBAL\Driver\IBMDB2\DB2Driver',
            'pdo_ibm'    => 'Doctrine\DBAL\Driver\PDOIbm\Driver',
            'pdo_sqlsrv' => 'Doctrine\DBAL\Driver\PDOSqlsrv\Driver',
            'mysqli'     => 'Doctrine\DBAL\Driver\Mysqli\Driver',
            'drizzle_pdo_mysql'  => 'Doctrine\DBAL\Driver\DrizzlePDOMySql\Driver',
            'sqlsrv'     => 'Doctrine\DBAL\Driver\SQLSrv\Driver',*/

            ];

    /**
     * Private constructor. This class cannot be instantiated.
     */
    private function __construct(){}

    /**
     * Creates a connection object based on the specified parameters.
     * This method returns a Doctrine\DBAL\Connection which wraps the underlying
     * driver connection.
     *
     * @param array                              $params       The parameters.
     * @param \Doctrine\DBAL\Configuration|null  $config       The configuration to use.
     * @param \Doctrine\Common\EventManager|null $eventManager The event manager to use.
     *
     * @return \Doctrine\DBAL\Connection
     *
     * @throws \Doctrine\DBAL\DBALException
     */
    public static function getConnection(
            array $params,
            Configuration $config = null,
            EventManager $eventManager = null,
            CacheManager $cacheManager = null)
    {        
        // create default config and event manager, if not set
        if ( ! $config) {
            $config = new Configuration();
        }
        if ( ! $eventManager) {
            $eventManager = new EventManager();
        }

        // check for existing pdo object
        if (isset($params['pdo']) && ! $params['pdo'] instanceof \PDO) {
            throw DBALException::invalidPdoInstance();
        } else if (isset($params['pdo'])) {
            $params['pdo']->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $params['driver'] = 'pdo_' . $params['pdo']->getAttribute(\PDO::ATTR_DRIVER_NAME);
        } else {
            self::_checkParams($params);
        }
        if (isset($params['driverClass'])) {
            $className = $params['driverClass'];
        } else {
            $className = self::$_driverMap[$params['driver']];
        }

        $driver = new $className();

        $wrapperClass = 'Doctrine\DBAL\Connection';
        if (isset($params['wrapperClass'])) {
            if (is_subclass_of($params['wrapperClass'], $wrapperClass)) {
               $wrapperClass = $params['wrapperClass'];
            } else {
                throw DBALException::invalidWrapperClass($params['wrapperClass']);
            }
        }

        return new $wrapperClass($params, $driver, $config, $eventManager, $cacheManager);
    }

    /**
     * Checks the list of parameters.
     *
     * @param array $params The list of parameters.
     *
     * @return void
     *
     * @throws \Doctrine\DBAL\DBALException
     */
    private static function _checkParams(array $params)
    {
        // check existence of mandatory parameters

        // driver
        if ( ! isset($params['driver']) && ! isset($params['driverClass'])) {
            throw DBALException::driverRequired();
        }

        // check validity of parameters

        // driver
        if ( isset($params['driver']) && ! isset(self::$_driverMap[$params['driver']])) {
            throw DBALException::unknownDriver($params['driver'], array_keys(self::$_driverMap));
        }

        if (isset($params['driverClass']) && ! in_array('Doctrine\DBAL\Driver', class_implements($params['driverClass'], true))) {
            throw DBALException::invalidDriverClass($params['driverClass']);
        }
    }
}
