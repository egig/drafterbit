<?php defined('ENVIRONMENT') or die();

file_exists($autoloadFile  = __DIR__.'/vendor/autoload.php')
    or die('Composer autoload file not found, run `composer install` ?');

$loader = require $autoloadFile;
$loader->addPsr4('Drafterbit\\', __DIR__.'/src');

$app = new Drafterbit\App\Kernel(ENVIRONMENT);
$app['loader'] = $loader;

$app['dir.system'] = basename(__DIR__);

return $app;