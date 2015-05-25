<?php

if ( ! function_exists('app')) {
    /**
     * Get the root application and  instance.
     *
     * @param  string  $service
     * @return mixed
     */
    function app($service = 'app' )
    {
        if ( 'app' != $service) {
            return app()[$service];
        }

        return \Drafterbit\Base\ContainerTrait::getInstance();
    }
}

if ( ! function_exists('request')) {
    /**
     * Capture global request
     *
     * @return void
     */
    function request()
    {
        return Drafterbit\Component\Http\Request::getInstance();
    }
}

if ( ! function_exists('path')) {
    /**
     * Get the path to the public folder.
     *
     * @return string
     */
    function path($path = null, $base = null )
    {
        return app('path' . $base).($path ? '/'.$path : $path);
    }
}

if ( ! function_exists('show_404')) {
    /**
     * Print 404 not found on screen and ends script
     *
     * @return void
     */
    function show_404()
    {
        throw new Symfony\Component\HttpKernel\Exception\NotFoundHttpException('Page Not Found');        
    }
}

if ( ! function_exists('base_url')) {
    /**
     * Base URL
     * 
     * Create a local URL based on your basepath.
     *
     * @param string $uri
     * @return string
     */
    function base_url($path = '')
    {
        return request()->getUriForPath('/'.trim($path, '/'));
    }
}

if ( ! function_exists('current_url')) {
    /**
     * Current URL
     * 
     * Get current url
     *
     * @param string $uri
     * @return string
     */
    function current_url($withQueryString = false)
    {
        $qs = '';
        if($withQueryString) {
            if (null !== $qs = request()->getQueryString()) {
                $qs = '?'.$qs;
            }
        }

        return request()->getSchemeAndHttpHost().request()->getBaseUrl().request()->getPathInfo().$qs;
    }
}

if ( ! function_exists('redirect')) {
    /**
     * Return new redirect response
     *
     * @return void
     */
    function redirect($path, $status = 302)
    {
        return new Symfony\Component\HttpFoundation\RedirectResponse($path, $status);
    }
}

if ( ! function_exists('set_cookie')) {
    /**
     * Set cookie.
     *
     * @return void
     */
    function set_cookie($name, $value, $time = 0, $path = '/', $domain = null, $secure = false, $httpOnly = true)
    {
        $cookie = app('cookie')->set($name, $value, $time, $path, $domain, $secure, $httpOnly);

        app('dispatcher')->addListener('cookie.queues', function($event) use ($cookie) {
            $event->getResponse()->headers->setCookie($cookie);
        });
    }
}

if ( ! function_exists('csrf_token')) {
    /**
     * Get csrf token
     *
     * @return string
     */
    function csrf_token()
    {
        return app('session')->get('_token');
    }
}

if ( ! function_exists('__')) {
    /**
     * Translate a String
     *
     * @return void
     */
    function __($id, array $parameters = [], $domain = null, $locale = null)
    {
        return app('translator')->trans($id, $parameters, $domain, $locale);
    }
}

if ( ! function_exists('__c')) {
    /**
     * Translate a String
     *
     * @return void
     */
    function __c($id, $number, array $parameters = [], $domain = null, $locale = null)
    {
        return app('translator')->transChoice($id, $number, $parameters, $domain, $locale);
    }
}

if ( ! function_exists('debug')) {

    /**
     * Debug backtrace
     *
     * @return string
     */
    function debug()
    {
        return '<pre>'.print_r(debug_backtrace(), true).'</pre>';
    }
}

if ( ! function_exists('dump')) {

    /**
     * var dump and ends script
     *
     * @return voud
     */
    function dump($v)
    {
         echo '<pre>';
         var_dump($v);
         echo '</pre>';
         exit();
    }
}