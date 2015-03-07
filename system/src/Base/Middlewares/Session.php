<?php namespace Drafterbit\Base\Middlewares;

use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpFoundation\Request;
use Drafterbit\Component\Session\SessionManager;

class Session implements HttpKernelInterface {

    /**
     * The wrapped kernel implementation.
     *
     * @var \Symfony\Component\HttpKernel\HttpKernelInterface
     */
    protected $kernel;

    /**
     * The session manager.
     *
     * @var \Drafterbit\Component\Kernel\Sessions\SessionManager
     */
    protected $manager;

    /**
     * Create a new session middleware.
     *
     * @param  \Symfony\Component\HttpKernel\HttpKernelInterface  $kernel
     * @param  \Drafterbit\Component\Session\SessionManager $manager
     * @return void
     */
    public function __construct(HttpKernelInterface $kernel, SessionManager $manager)
    {
        $this->kernel = $kernel;
        $this->manager = $manager;
    }

    /**
     * Handle the given request and get the response.
     *
     * @implements HttpKernelInterface::handle
     *
     * @param  \Symfony\Component\HttpFoundation\Request  $request
     * @param  int   $type
     * @param  bool  $catch
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, $type = HttpKernelInterface::MASTER_REQUEST, $catch = true)
    {
        $this->startSession($request);

        $response = $this->kernel->handle($request, $type, $catch);
        
        $this->closeSession();

        return $response;
    }

    /**
     * Start the session.
     *
     * @param Symfony\Component\HttpFoundation\Request; 
     * @return void
     */
    protected function startSession( Request $request)
    {
        if ($this->cookieDriven()) {

            $name = $this->manager->getName();
            $id = $request->cookies->get($name);

            if(!$id) {
                $id = $this->generateSessionId();
            }

            $this->manager->setId($id);
        }

        $this->manager->start();
    }

    /**
     * Close the session.
     *
     * @return boid
     */
    protected function closeSession()
    {
        if ($this->cookieDriven()) {

            $name = $this->manager->getName();
            $id = $this->manager->getid();
           
            set_cookie($name, $id);
        }

        $this->manager->save();
    }

    /**
     * Wether user user cookie or not for session.
     *
     * @return bool
     */
    public function cookieDriven()
    {
        return $this->manager->getDefaultDriver() == 'cookie';
    }

    /**
     * Get a new, random session ID.
     *
     * @return string
     */
    protected function generateSessionId()
    {
        return sha1(uniqid(true).str_random(25).microtime(true));
    }

}
