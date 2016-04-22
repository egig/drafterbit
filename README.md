# README.md

## What is Drafterbit ?

Drafterbit is self-hosted web software you can use to create a website, yes, like WordPress, built on top of Symfony Full-Stack Framework. Currently still in early phase.

[![Build Status](https://travis-ci.org/drafterbit/drafterbit.svg)](https://travis-ci.org/drafterbit/drafterbit)

[![Coverage Status](https://coveralls.io/repos/github/drafterbit/drafterbit/badge.svg?branch=master)](https://coveralls.io/github/drafterbit/drafterbit?branch=master)

## Install
For now you can just do the following step to get it running (I assume you use Ubuntu):

1. Make sure that you have [composer](https://getcomposer.org/) and [bower](https://bower.io/) installed in your computer.
2. Open Terminal then go to web doc root. e.g:
    ```shell
    cd /var/www/
    ```
    
3. Create composer project (use -`sdev` since we have no stable version yet)
    ```shell
    composer create-project drafterbit/drafterbit -sdev
    ```

4. Go to created directory

    ```shell
    cd drafterbit
    ```

5. Check app configuration, e.g by visitting `http://localhost/drafterbit/web/config.php`
    ```
 then fix major problem appeared on your screen if any.

6. Install web dependencies
    ```shell
    bower install
    php app/console assets:install
    ```
    
7. Edit or create `parameters.yml` file in `app/config` directory if it's not generated during composer install.
8. Do the install by
    ```shell
    php app/console drafterbit:install
    ```
    
9. From here, you can just visit browser (IE not supported yet) to check if it all works, e.g: `http://localhost/drafterbit/web`. Go to `/admin` to go to administration panel then login using credential you created during install.

Please let us know if you get any problem: <https://github.com/drafterbit/drafterbit/issues>.

## Learn
There is no documentation at all yet, for now you can just ask me anything anytime thru this google forum : <https://groups.google.com/forum/#!forum/drafterbit>

## Contribute
Drafterbit is an opensource and intended to be community-driven project. Any kind of contribution (code, translation, stars, bug reports, feature request) are welcome.

## License
Drafterbit is licensed under the MIT license.

