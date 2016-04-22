<?php

require_once __DIR__ . '/../app/autoload.php';

exec("php bin/console doctrine:fixtures:load --no-interaction --env=test");