<?php version_compare($ver = PHP_VERSION, $req = '5.4.0', '>=') or
    exit(sprintf('You are running PHP %s, but Drafterbit needs at least <strong>PHP %s</strong> to run.', $ver, $req));

define('ENVIRONMENT', 'dev');

$content = __DIR__.'/content';
$system = __DIR__.'/system/';

$app = require $system.'bootstrap.php';

$app->run();