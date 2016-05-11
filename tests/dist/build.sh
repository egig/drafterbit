#!/bin/env bash

phing prepare

echo dumping...
php bin/console assets:install web --env=prod --quiet
php bin/console assetic:dump --env=prod --quiet
composer dump-autoload --optimize

echo clean dumping junks...
phing clean_dumping_junks

echo copying...
mkdir ${PWD}/_build
mkdir ${PWD}/_build/web

cp -Rf ${PWD}/app         ${PWD}/_build/app
cp -Rf ${PWD}/src         ${PWD}/_build/src
cp -Rf ${PWD}/var         ${PWD}/_build/var
cp -Rf ${PWD}/vendor      ${PWD}/_build/vendor
cp -Rf ${PWD}/web/assets  ${PWD}/_build/web/assets
cp -Rf ${PWD}/web/app.php     ${PWD}/_build/web/app.php
cp -Rf ${PWD}/web/config.php     ${PWD}/_build/web/config.php
cp -Rf ${PWD}/web/install.php     ${PWD}/_build/web/install.php
cp -Rf ${PWD}/web/robots.txt   ${PWD}/_build/web/robots.txt
cp -Rf ${PWD}/web/favicon.ico ${PWD}/_build/web/favicon.ico
cp -Rf ${PWD}/web/.htaccess   ${PWD}/_build/web/.htaccess
cp -Rf ${PWD}/web/apple-touch-icon.png      ${PWD}/_build/web/apple-touch-icon.png
cp -Rf ${PWD}/_build/app/config/parameters.yml.dist ${PWD}/_build/app/config/parameters.yml

chmod -R 0777 ${PWD}/_build/var
chmod 0777  ${PWD}/_build/app/config/parameters.yml

echo clean up...
rm -R ${PWD}/_build/vendor/web

phing
