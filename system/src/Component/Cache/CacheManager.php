<?php namespace Drafterbit\Component\Cache;

use Memcache;
use Drafterbit\Component\Support\Driverable;
use Doctrine\Common\Cache;

class CacheManager extends Driverable {

    /**
     * Create array cache.
     *
     * @return Doctrine\Common\Cache\ArrayCache;
     */
    public function arrayDriver()
    {
        return new Cache\ArrayDriver();
    }
    
    /**
     * Create filesystem Driver.
     *
     * @return Doctrine\Common\Cache\FilesystemDriver
     */
    public function fileDriver()
    {
        return new FilesystemCache($this->config['file.path']);
    }

    /**
     * Create Redis Driver.
     *
     * @return Doctrine\Common\Cache\RedisCache;
     */
    public function redisDriver()
    {
        $redis = new Redis();
        $redis->connect(
            $this->config['redis.host'],
            $this->config['redis.port']);

        $cacheDriver = new Cache\RedisCache();
        $cacheDriver->setRedis($redis);

        return $cacheDriver;
    }

    /**
     * Create memcached Driver
     *
     * @return Doctrine\Common\Cache\MemcachedCache;
     */
    public function memcachedDriver()
    {
        $memcached = new Memcached();
        $memcached->addServer(
            $this->config['memcached.host'],
            $this->config['memcached.port'],
            $this->config['memcached.weight']);

        $cacheDriver = new Cache\MemcachedCache();
        $cacheDriver->setMemcached($memcached);

        return $cacheDriver;
    }

    /**
     * Create memcache Driver'
     *
     * @return memcache
     */
    public function mamcacheDriver()
    {
        $mamcache = new Memcache();
        $memcache->connect(
            $this->config['memcache.host'],
            $this->config['memcache.port'],
            $this->config['memcache.timeout']);

        $cacheDriver = new Cache\MemcacheCache();
        $cacheDriver->setMemcache($memcache);

        return $cacheDriver;
    }

    /**
     * Create xcache driver.
     *
     * @return Doctrine\Common\Cache\XcacheCache
     */
    public function xcacheDriver()
    {
        return new Cache\XcacheCache();
    }

    /**
     * Create apc driver.
     *
     * @return Doctrine\Common\Cache\ApcCache
     */
    public function apcDriver()
    {
        return new Cache\ApcCache();
    }

    /**
     * Get default driver
     *
     * @return string
     */
    public function getDefaultDriver()
    {
        return $this->config['default'];
    }
}