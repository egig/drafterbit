<?php namespace Drafterbit\Base\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Drafterbit\Component\Migration\Migrator;

class MigrationServiceProvider implements ServiceProviderInterface {

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register(Container $app)
    {    
        $app['migrator'] = function() use ($app){
            $migrator = new Migrator();
            $migrator->addGlobal('app', $app);
            return $migrator;
        };
    }
}