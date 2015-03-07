<?php namespace Drafterbit\App\Middlewares;

use Drafterbit\Extensions\User\Auth\Exceptions\UserNotAuthorizedException;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drafterbit\Component\Routing\Router as RouteManager;
use Drafterbit\Component\Session\SessionManager;
use Drafterbit\Base\Application;

class Security implements HttpKernelInterface
{

    /**
     * The wrapped kernel implementation.
     *
     * @var \Symfony\Component\HttpKernel\HttpKernelInterface
     */
    protected $kernel;

    /**
     * Darafterbit Application
     *
     * @var \Drafterbit\Base\Application
     */
    protected $app;

    /**
     * The session manager.
     *
     * @var \Drafterbit\Component\Sessions\SessionManager
     */
    protected $session;

    /**
     * Create a new session middleware.
     *
     * @param \Symfony\Component\HttpKernel\HttpKernelInterface $app
     * @param \Drafterbit\Component\Routing\Router              $router
     */
    public function __construct(HttpKernelInterface $kernel, Application $app, SessionManager $session)
    {
        $this->kernel = $kernel;
        $this->app = $app;
        $this->session = $session;
    }

    /**
     * Handle the given request and get the response.
     *
     * @implements HttpKernelInterface::handle
     *
     * @param  \Symfony\Component\HttpFoundation\Request $request
     * @param  int                                       $type
     * @param  bool                                      $catch
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, $type = HttpKernelInterface::MASTER_REQUEST, $catch = true)
    {
        if ($access = $request->getMatchingRoute()->getOption('access')) {
            try {
                $auth = $this->app->getExtension('user')->model('Auth');
                $auth->restrict($access);

            } catch (UserNotAuthorizedException $e) {
                $message = $e->getMessage();

                if ($this->app['input']->isAjax()) {
                    return new JsonResponse(
                        [
                        'error' => [
                            'type' => 'auth',
                            'message' => $message,
                        ]
                        ]
                    );
                }

                $referer = $this->app['input']->headers('referer') ?
                    $this->app['input']->headers('referer') : admin_url('dashboard');
                
                $this->session->getFlashBag()->add('messages', ['text' => $message, 'type' => 'error']);
                return redirect($referer);
            }
        }
        
        if ($request->getMatchingRoute()->getOption('csrf')) {
            $csrfToken = $this->session->get('_token');
            $csrfInput = $request->get('csrf');

            if ($csrfToken !== $csrfInput) {
                throw new \RuntimeException("invalid session");
            }
        }

        $response = $this->kernel->handle($request, $type, $catch);
        
        return $response;
    }
}
