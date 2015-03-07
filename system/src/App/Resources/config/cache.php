<?php return [

/**
 *--------------------------------------------------------------------------
 * Cache driver
 *--------------------------------------------------------------------------
 *
 * This option tells driver which driver to us either one of array, file
 * xcache, apc, memcache, memcache, or wincache. All proudly provided by our
 * powerfull Doctrine cache. Default is file.
 */
    'default' => 'file',

/**
 *--------------------------------------------------------------------------
 * Filesystem Cache Path
 *--------------------------------------------------------------------------
 *
 * This option used only if the file is your driver. You can set it anywhere
 * While its good practice to not to forget to set the directory to be
 * writable, Doctrine cache will do it for you.
 */
    'file.path' => '%content_dir%/cache/data',
/**
 *--------------------------------------------------------------------------
 * Memcache Options
 *--------------------------------------------------------------------------
 *
 * This option used by memcache driver.
 */

    'memcache.host' => '',
    'memcache.port' => '',
    'memcache.timeout' => '',
/**
 *--------------------------------------------------------------------------
 * Memcached Options
 *--------------------------------------------------------------------------
 *
 * This options used by memcached driver.
 */
    'memcached.host' => '',
    'memcached.port' => '',
    'memcached.weight' => '',

/**
 *--------------------------------------------------------------------------
 * Redis Options
 *--------------------------------------------------------------------------
 *
 * This options used by redis driver.
 */
    'redis.host' => '',
    'redis.port' => ''

];
