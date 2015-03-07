<?php define('ENVIRONMENT', 'dev');

$app = require __DIR__.'/system/boot.php';

$app->setContentDir(__DIR__.'/content');
$app->setConfigFile(__DIR__.'/config.php');

$app->run();
