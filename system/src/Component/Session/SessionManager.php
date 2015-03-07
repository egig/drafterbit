<?php namespace Drafterbit\Component\Session;

use Drafterbit\Base\Application;
use Drafterbit\Component\Support\Driverable;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Attribute\AttributeBag;
use Symfony\Component\HttpFoundation\Session\Flash\FlashBag;
use Symfony\Component\HttpFoundation\Session\Storage\NativeSessionStorage;
use Symfony\Component\HttpFoundation\Session\Storage\Handler\NullSessionHandler;
use Symfony\Component\HttpFoundation\Session\Storage\Handler\NativeSessionHandler;
use Symfony\Component\HttpFoundation\Session\Storage\Handler\NativeFileSessionHandler;

class SessionManager extends Driverable {

    /**
     * Kernel.
     *
     * @var \Drafterbit\Component\Kernel\Kernel
     */
    protected $kernel;

    /**
     * Constructor
     *
     * @return void
     */
    public function __construct(Application $kernel, $config = [])
    {
        parent::__construct($config);
        $this->kernel = $kernel;
    }

    /**
     * Array handler
     *
     * @return object
     */
    public function cookieDriver()
    {
        $handler = new CookieSessionHandler(Request::createFromGlobals());
        return $this->buildCustomSession($handler);
    }
    
    /**
     * Array handler
     *
     * @return object
     */
    public function arrayDriver()
    {
        return $this->buildNativeSession( new NullSessionHandler());
    }

    /**
     * Native handler
     *
     * @return object
     */
    public function fileDriver()
    {
        return $this->buildNativeSession(new NativeFileSessionHandler($this->getOptions()['save_path']));
    }

    /**
     * Native handler
     *
     * @return object
     */
    public function nativeDriver()
    {
        return $this->buildNativeSession(new NativeSessionHandler());
    }

    /**
     * Create the native Session
     *
     * @param object
     * @return object
     */
    public function buildNativeSession($handler)
    {
        $storage = new NativeSessionStorage( $this->getOptions(), $handler);
        $attributeBag = new AttributeBag('_dt_sess');
        $flashBag = new FlashBag('_dt_flashes');
        return new Session($storage, $attributeBag, $flashBag);
    }

    /**
     * Create the Custom Session
     *
     * @param object
     * @return object
     */
    public function buildCustomSession($handler)
    {
        $storage = new CustomSessionStorage($this->config['session.name'], $handler, $this->kernel['encrypter']);
        $attributeBag = new AttributeBag('_dt_sess');
        $flashBag = new FlashBag('_dt_flashes');
        return new Session($storage, $attributeBag, $flashBag);
    }

    /**
     * Get the default session driver name.
     *
     * @return string
     */
    public function getDefaultDriver()
    {
        return $this->config['driver'];
    }

    /**
     * Get session options
     *
     * @return array
     */
    public function getOptions()
    {
        return  [
            'name'                 => $this->config['session.name'],
            'save_path'         => $this->config['save.path'],
            'gc_divisor'         => $this->config['gc.divisor'],
            'gc_probability'     => $this->config['gc.probability'],
            'cookie_lifetime'     => $this->config['cookie.lifetime']
        ];
    }

}