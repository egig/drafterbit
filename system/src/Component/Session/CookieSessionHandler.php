<?php namespace Drafterbit\Component\Session;

use Drafterbit\Component\Cookie\CookieJar;
use Symfony\Component\HttpFoundation\Request;

class CookieSessionHandler implements \SessionHandlerInterface {

    /**
     * The request instance.
     *
     * @var \Symfony\Component\HttpFoundation\Request
     */
    protected $request;

    /**
     * Create a new cookie driven handler instance.
     *
     * @param  Drafterbit\Component\CookieJar  $cookie
     * @param  int  $minutes
     * @return void
     */
    public function __construct(Request $request, $minutes = 0)
    {
        $this->request = $request;
        $this->minutes = $minutes;
    }

    /**
     * {@inheritDoc}
     */
    public function open($savePath, $sessionName)
    {
        return true;
    }

    /**
     * {@inheritDoc}
     */
    public function close()
    {
        return true;
    }

    /**
     * {@inheritDoc}
     */
    public function read($sessionId)
    {
        return $this->request->cookies->get($sessionId) ?: '';
    }

    /**
     * {@inheritDoc}
     */
    public function write($sessionId, $data)
    {
        set_cookie($sessionId, $data, $this->minutes);
    }

    /**
     * {@inheritDoc}
     */
    public function destroy($sessionId)
    {
        set_cookie($sessionId, null,  -2628000);
    }

    /**
     * {@inheritDoc}
     */
    public function gc($lifetime)
    {
        return true;
    }

}