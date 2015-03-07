<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Database\DriverManager;

class DatabaseServiceProvider implements ServiceProviderInterface {

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register(Container $app)
    {
        $dbConfig = $app['config']->get('database');

        $app['db'] = function() use($dbConfig, $app) {
            
            if(!isset($dbConfig['debug'])) {
                $dbConfig['debug'] = $app['debug'];
            }

            if(!isset($dbConfig['cache_dir'])) {
                $dbConfig['cache_dir'] = $app['config']['cache.file.path'];
            }

            $cacheManager = $app['cache'];

            $dbConfig['wrapperClass'] = 'Drafterbit\\Component\\Database\\Connection';
            return DriverManager::getConnection($dbConfig, null, null, $cacheManager);
        };
    }
}