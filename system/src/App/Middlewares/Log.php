<?php namespace Drafterbit\App\Middlewares;

use Drafterbit\Base\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\HttpKernelInterface;

class Log implements HttpKernelInterface
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
    public function __construct(HttpKernelInterface $kernel, Application $app)
    {
        $this->kernel = $kernel;
        $this->app = $app;
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
        $route = $request->getMatchingRoute();

        $beforeLog = (array) $route->getOption('log.before');

        $requestContext = array_merge($request->query->all(), $request->request->all());

        unset($requestContext['password']);

        if ($beforeLog) {
            if ($userId = $this->app['session']->get('user.id')) {
                $context = [
                    'user_id' => $userId,
                    'ip' => $request->getClientIp()
                ];

                $context = array_merge($context, $requestContext);

                $message = strtr($beforeLog['message'], $this->createLogMessageContext($context));
                $this->app['log.db']->addInfo($message, $context);
            }
        }

        $response = $this->kernel->handle($request, $type, $catch);

        $afterLog = (array) $route->getOption('log.after');

        if ($afterLog) {
            if ($userId = $this->app['session']->get('user.id')) {
                $context = [
                    'user_id' => $userId,
                    'ip' => $request->getClientIp()
                ];

                $context = array_merge($context, $requestContext);

                // if response is json, we creat response context;
                if ($response instanceof JsonResponse) {
                    $responseContext = json_decode($response->getContent(), true);
                    if (json_last_error() == JSON_ERROR_NONE) {
                        $context = array_merge($context, $responseContext);
                    }
                }

                $message = strtr($afterLog['message'], $this->createLogMessageContext($context));
                
                $this->app['log.db']->addInfo($message, $context);
            }
        }

        return $response;
    }

    private function createLogMessageContext($context)
    {
        $newArray = [];
        foreach ($context as $key => $value) {
            if (is_string($value)) {
                $newArray['%'.$key.'%'] = $value;
            }
        }
        return $newArray;
    }
}
