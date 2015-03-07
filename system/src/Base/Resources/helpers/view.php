<?php

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