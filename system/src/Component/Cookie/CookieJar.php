<?php namespace Drafterbit\Component\Cookie;

use Symfony\Component\HttpFoundation\Cookie;

class CookieJar {
    
    /**
     * Create a new cookie instance.
     *
     * @param  string  $name
     * @param  string  $value
     * @param  int     $minutes
     * @param  string  $path
     * @param  string  $domain
     * @param  bool    $secure
     * @param  bool    $httpOnly
     * @return \Symfony\Component\HttpFoundation\Cookie
     */
    public function set($name, $value, $minutes = 0, $path = '/', $domain = null, $secure = false, $httpOnly = true)
    {
        $time = ($minutes == 0) ? 0 : time() + ($minutes * 60);
        return new Cookie($name, $value, $time, $path, $domain, $secure, $httpOnly);
    }

    /**
     * Create a cookie that lasts "forever" (five years).
     *
     * @param  string  $name
     * @param  string  $value
     * @param  string  $path
     * @param  string  $domain
     * @param  bool    $secure
     * @param  bool    $httpOnly
     * @return \Symfony\Component\HttpFoundation\Cookie
     */
    public function setForever($name, $value, $path = null, $domain = null, $secure = false, $httpOnly = true)
    {
        return $this->set($name, $value, 2628000, $path, $domain, $secure, $httpOnly);
    }

    /**
     * Expire the given cookie.
     *
     * @param  string  $name
     * @return \Symfony\Component\HttpFoundation\Cookie
     */
    public function expire($name)
    {
        return $this->set($name, null, -2628000);
    }
}