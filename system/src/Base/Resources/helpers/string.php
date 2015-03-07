<?php

if ( ! function_exists('starts_with')) {
    /**
     * Determine if a given string starts with a given substring.
     *
     * @param  string  $haystack
     * @param  string|array  $needle
     * @return bool
     */
    function starts_with($haystack, $needles)
    {
        foreach ((array) $needles as $needle) {
            if (strpos($haystack, $needle) === 0) return true;
        }

        return false;
    }
}

if ( ! function_exists('ends_with')) {
    /**
     * Determine if a given string ends with a given substring.
     *
     * @param string $haystack
     * @param string|array $needle
     * @return bool
     */
    function ends_with($haystack, $needles)
    {
        foreach ((array) $needles as $needle)
        {
            if ($needle == substr($haystack, strlen($haystack) - strlen($needle))) return true;
        }

        return false;
    }
}

if ( ! function_exists('str_match_pattern')) {
    /**
     * Determine if a given string matches a given pattern.
     *
     * @param  string  $pattern
     * @param  string  $value
     * @return bool
     */
    function str_match_pattern($pattern, $value)
    {
        if ($pattern == $value) return true;

        $pattern = preg_quote($pattern, '#');

        if ($pattern !== '/') {
            $pattern = str_replace('\*', '.*', $pattern).'\z';
        } else {
            $pattern = '/$';
        }

        return (bool) preg_match('#^'.$pattern.'#', $value);
    }
}


if ( ! function_exists('str_random')) {
    /**
     * Generate a random string.
     *
     * @param  int     $length
     * @return string
     */
    function str_random($length = 16, $special_chars = false, $extra_special_chars = false)
    {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        if ( $special_chars )
            $chars .= '!@#$%^&*()';
        if ( $extra_special_chars )
            $chars .= '-_ []{}<>~`+=,.;:/?|';

        $key = '';
        for ( $i = 0; $i < $length; $i++ ) {
            $key .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }

        return $key;
    }
}

if ( ! function_exists('snake_case')) {
    /**
     * Convert a string to snake case.
     *
     * @param  string  $value
     * @param  string  $delimiter
     * @return string
     */
    function snake_case($value, $delimiter = '_')
    {
        $replace = '$1'.$delimiter.'$2';

        $value = preg_replace('/([A-Z\d]+)([A-Z][a-z])/', $replace, $value);
        $value = preg_replace('/([a-z\d])([A-Z])/', $replace, $value);
        $value = str_replace([' ', '_'], $delimiter, $value);
        $value = strtolower($value);

        return $value;
    }
}

if ( ! function_exists('studly_case')) {
    /**
     * Convert a value to studly caps case.
     *
     * @param  string  $value
     * @return string
     */
    function studly_case($value)
    {
        $value = ucwords(str_replace(['-', '_'], ' ', $value));

        return str_replace(' ', '', $value);
    }
}

if ( ! function_exists('camel_case')) {
    /**
     * Convert a value to camel case.
     *
     * @param  string  $value
     * @return string
     */
    function camel_case($value)
    {
        return lcfirst(studly_case($value));
    }
}


if ( ! function_exists('slug')) {

    /**
    * Generate a URL friendly "slug" from a given string.
    *
    * @param string $title
    * @param string $separator
    * @return string
    */
    function slug($title, $separator = '-')
    {
        $title = \Patchwork\Utf8::toAscii($title);
        // Convert all dashes/underscores into separator
        $flip = $separator == '-' ? '_' : '-';
        $title = preg_replace('!['.preg_quote($flip).']+!u', $separator, $title);
        
        // Remove all characters that are not the separator, letters, numbers, or whitespace.
        $title = preg_replace('![^'.preg_quote($separator).'\pL\pN\s]+!u', '', mb_strtolower($title));
        
        // Replace all separator characters and whitespace by a single separator
        $title = preg_replace('!['.preg_quote($separator).'\s]+!u', $separator, $title);
        return trim($title, $separator);
    }
}