# README.md

## What is Drafterbit ?
Drafterbit is self-hosted web software you can use to create a website, yes, like WordPress, built on top of Symfony2 Full-Stack Framework. Currently still in active development. Contributor needed !

[![Build Status](https://travis-ci.org/drafterbit/drafterbit.svg)](https://travis-ci.org/drafterbit/drafterbit)

## Install
Following step guides you to install Drafterbit for development purpose. (I assume we are one OS, Ubuntu).

1. Requirements, make sure that you have following software installed on your computer:
    
    1. Web server (Apache or Nginx)
    2. PHP 5.4+
    3. Database Server (Mysql suggested)
    4. [Composer](https://getcomposer.org/)
    5. [Bower](https://bower.io/)
    6. [Sass](http://sass-lang.com/)
    7. [Uglifyjs](https://github.com/mishoo/UglifyJS)
    8. [Uglifycss](https://github.com/fmarcia/UglifyCSS)

2. Go to your working directory via terminal, it is usually located at document root of your web server.
    ```shell
    cd /var/www/
    ```
    
3. Create composer project (use -`sdev` since we are working for development puspose)
    ```shell
    composer create-project drafterbit/application drafterbit -sdev
    ```

4. Go to created directory

    ```shell
    cd drafterbit
    ```

5. Check app configuration, e.g by visitting `http://localhost/drafterbit/config.php`, or on cli by running
    ```shell
    php app/check.php
    ```
 then fix major problem appeared on your screen if any.

6. Install web dependencies
    ```shell
    bower install
    php app/console assets:install
    ```
    
7. Edit or create file named `parameters.yml` in `app/config` directory.
8. Do the install by
    ```shell
    php app/console drafterbit:install
    ```
    
9. From here, you can just visit browser (IE not supported yet) to check if it all works, e.g: `http://localhost/drafterbit`. Go to `/admin` to go to administration panel then login using credential you created during install.

Please let us know if you get any problem: <https://github.com/drafterbit/drafterbit/issues>.

## Learn
There is no documentation at all yet, for now you can just ask me anything anytime thru this google forum : <https://groups.google.com/forum/#!forum/drafterbit>

## Contribute
Drafterbit is an opensource and intended to be community-driven project. Any kind of contribution (code, translation, stars, bug reports, feature request) are welcome.

## License
Drafterbit is licensed under the MIT license.
