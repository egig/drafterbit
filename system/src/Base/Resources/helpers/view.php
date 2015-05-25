<?php

if ( ! function_exists('_block')) {
    /**
     * Get a block
     *
     * @param  string  $name
     * @return mixed
     */
    function _block($name, $default = false)
    {
        return app('template')->block($name, $default);
    }
}

if ( ! function_exists('_extend')) {
    /**
     * Add parent for current template view
     *
     * @param  string  $name
     * @return mixed
     */
    function _extend($name)
    {
        app('template')->extend($name);
    }
}

if ( ! function_exists('_start')) {
    /**
     * Start a block
     *
     * @param  string  $name
     * @return mixed
     */
    function _start($name)
    {
        app('template')->start($name);
    }
}

if ( ! function_exists('_end')) {
    /**
     * Start a block
     *
     * @param  string  $name
     * @return mixed
     */
    function _end()
    {
        app('template')->end();
    }
}

if ( ! function_exists('_css')) {
    /**
     * Add css
     *
     * @param  string  $name
     * @return mixed
     */
    function _css($input, $filter = [])
    {
        app('template')->css($input, $filter);
    }
}

if ( ! function_exists('_js')) {
    /**
     * Add js
     *
     * @param  string  $name
     * @return mixed
     */
    function _js($input, $filter = [])
    {
        app('template')->js($input, $filter);
    }
}