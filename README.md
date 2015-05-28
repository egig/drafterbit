# README.md

## What is Drafterbit ?
Drafterbit is self-hosted web software you can use to create a website, yes, like WordPress, built on top of Symfony2 Full-Stack Framework. Currently in ~~slow~~ active development.

[![Build Status](https://travis-ci.org/drafterbit/drafterbit.svg)](https://travis-ci.org/drafterbit/drafterbit)

## Install
Installation package will be available for download soon. For now you can just do the following step to get it running (I assume you use Ubuntu):

1. Make sure that you have [composer](https://getcomposer.org/) and [bower](https://bower.io/) installed in your computer.
2. Open Terminal then go to web doc root. e.g:
    ```shell
    cd /var/www/
    ```
    
3. Clone this repo (**master** branch)
    ```shell
    git clone https://github.com/drafterbit/drafterbit.git -b master
    ```
    
4. Go to cloned directory then install php dependencies
    ```shell
    cd drafterbit
    composer install --no-dev --prefer-dist
    ```
5. Make sure following directory is writable by current user and web server:
    ```shell
    app/cache
    app/logs
    web/upload
    ```

6. Then install web dependencies
    ```shell
    bower install
    php app/console assets:install
    ```
    
7. Edit or create `parameters.yml` file in `app/config` directory if it's not generated during composer install, then Load database and fixtures
	```shell
	php app/console doctrine:schema:create
	php app/console doctrine:fixtures:load
	```

8. From here, you can just visit browser (IE not supported yet) to check if it all works, e.g: `http://localhost/drafterbit/web`. Go to `/admin` to go to administration panel, first created user is 'admin' with password also 'admin'.

Please let me know thru the google forum below if you get any problem.

## Learn
There is no documentation at all yet, for now you can just ask me anything anytime thru  this google forum : <https://groups.google.com/forum/#!forum/drafterbit>

## Contribute
Drafterbit is an opensource and intended to be community-driven project. Any kind of contribution (code, translation, stars, bug reports, feature request) are welcome.

### Issue Tracker
Issue tracker will not be opened until the initial release, if you are doing test then have something to discuss, have a request or any suggestion, please use the google forum above.

## License
Drafterbit is licensed under the MIT license.