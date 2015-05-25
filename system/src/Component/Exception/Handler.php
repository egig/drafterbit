<?php namespace Drafterbit\Component\Exception;

use Closure;
use ErrorException;
use ReflectionFunction;
use Drafterbit\Component\Kernel\Kernel;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\Debug\Exception\FatalErrorException as FatalError;

class Handler {
    
    /**
     * The plain exception displayer.
     *
     * @var \Drafterbit\Component\Exception\ExceptionDisplayerInterface
     */
    protected $plainDisplayer;

    /**
     * The debug exception displayer.
     *
     * @var \Drafterbit\Component\Exception\ExceptionDisplayerInterface
     */
    protected $debugDisplayer;

    /**
     * Indicates if the application is in debug mode.
     *
     * @var bool
     */
    protected $debug;

    /**
     * All of the register exception handlers.
     *
     * @var array
     */
    protected $handlers = [];

    /**
     * All of the handled error messages.
     *
     * @var array
     */
    protected $handled = [];

    /**
     * Create a new error handler instance.
     *
     * @param  \Drafterbit\Component\Kernel\Application  $app
     * @param  \Drafterbit\Component\Kernel\Exception\DisplayerInterface  $plainDisplayer
     * @param  \Drafterbit\Component\Kernel\Exception\DisplayerInterface  $debugDisplayer
     * @return void
     */
    public function __construct(
                                DisplayerInterface $plainDisplayer,
                                DisplayerInterface $debugDisplayer,
                                $debug = true)
    {
        $this->debug = $debug;
        $this->plainDisplayer = $plainDisplayer;
        $this->debugDisplayer = $debugDisplayer;
    }

    /**
     * Register the exception / error handlers for the application.
     *
     * @param  string  $environment
     * @return void
     */
    public function register($environment)
    {
        ini_set('display_errors', 'Off');

           $this->registerErrorHandler();

        $this->registerExceptionHandler();

        if ($environment != 'testing') $this->registerShutdownHandler();

        return $this;
    }

    /**
     * Register the PHP error handler.
     *
     * @return void
     */
    protected function registerErrorHandler()
    {
        set_error_handler([$this, 'handleError']);
    }

    /**
     * Register the PHP exception handler.
     *
     * @return void
     */
    protected function registerExceptionHandler()
    {
        set_exception_handler([$this, 'handleException']);
    }

    /**
     * Register the PHP shutdown handler.
     *
     * @return void
     */
    protected function registerShutdownHandler()
    {
        register_shutdown_function([$this, 'handleShutdown']);
    }

    /**
     * Handle a PHP error for the application.
     *
     * @param  int     $level
     * @param  string  $message
     * @param  string  $file
     * @param  int     $line
     * @param  array   $context
     */
    public function handleError($level, $message, $file, $line, $context)
    {
        if (error_reporting() & $level) {
            $e = new ErrorException($message, $level, 0, $file, $line);

            $this->handleException($e);
        }
    }

    /**
     * Handle an exception for the application.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function handleException($exception)
    {
        $response = $this->callCustomHandlers($exception);

        if ( ! is_null($response)) {
            return $response;
        } else {
            $this->displayException($exception);
        }

        $this->bail();
    }

    /**
     * Handle the PHP shutdown event.
     *
     * @return void
     */
    public function handleShutdown()
    {
        $error = error_get_last();

        if ( ! is_null($error)) {
            extract($error);

            if ( ! $this->isFatal($type)) return;

            $this->handleException(new FatalError($message, $type, 0, $file, $line));
        }
    }

    /**
     * Determine if the error type is fatal.
     *
     * @param  int   $type
     * @return bool
     */
    protected function isFatal($type)
    {
        return in_array($type, [E_ERROR, E_CORE_ERROR, E_COMPILE_ERROR, E_PARSE]);
    }

    /**
     * Handle a console exception.
     *
     * @param  Exception  $exception
     * @return void
     */
    public function handleConsole($exception)
    {
        return $this->callCustomHandlers($exception, true);
    }

    /**
     * Handle the given exception.
     *
     * @param  Exception  $exception
     * @param  bool  $fromConsole
     * @return void
     */
    protected function callCustomHandlers($exception, $fromConsole = false)
    {
        foreach ($this->handlers as $handler) {
            if ( ! $this->handlesException($handler, $exception)) {
                continue;
            } elseif ($exception instanceof HttpExceptionInterface) {
                $code = $exception->getStatusCode();
            } else {
                $code = 500;
            }

            try {
                $response = $handler($exception, $code, $fromConsole);
            } catch (\Exception $e) {
                $response = $this->formatException($e);
            }

            if (isset($response) and ! is_null($response)) {
                return $response;
            }
        }
    }

    /**
     * Display the given exception to the user.
     *
     * @param  \Exception  $exception
     * @return void
     */
    protected function displayException($exception)
    {
        
        $displayer = $this->debug ? $this->debugDisplayer : $this->plainDisplayer;

        return $displayer->display($exception);
    }

    /**
     * Determine if the given handler handles this exception.
     *
     * @param  Closure    $handler
     * @param  Exception  $exception
     * @return bool
     */
    protected function handlesException(Closure $handler, $exception)
    {
        $reflection = new ReflectionFunction($handler);

        return $reflection->getNumberOfParameters() == 0 or $this->hints($reflection, $exception);
    }

    /**
     * Determine if the given handler type hints the exception.
     *
     * @param  ReflectionFunction  $reflection
     * @param  Exception  $exception
     * @return bool
     */
    protected function hints(ReflectionFunction $reflection, $exception)
    {
        $parameters = $reflection->getParameters();

        $expected = $parameters[0];

        return ! $expected->getClass() or $expected->getClass()->isInstance($exception);
    }

    /**
     * Format an exception thrown by a handler.
     *
     * @param  Exception  $e
     * @return string
     */
    protected function formatException(\Exception $e)
    {
        $location = $e->getMessage().' in '.$e->getFile().':'.$e->getLine();

        return 'Error in exception handler: '.$location;
    }

    /**
     * Register an application error handler.
     *
     * @param  Closure  $callback
     * @return void
     */
    public function error(Closure $callback)
    {
        array_unshift($this->handlers, $callback);
    }

    /**
     * Register an application error handler at the bottom of the stack.
     *
     * @param  Closure  $callback
     * @return void
     */
    public function pushError(Closure $callback)
    {
        $this->handlers[] = $callback;
    }

    /**
     * Exit the application.
     *
     * @return void
     */
    protected function bail()
    {
        exit(1);
    }

    /**
     * Set the debug level for the handler.
     *
     * @param  bool  $debug
     * @return void
     */
    public function setDebug($debug)
    {
        $this->debug = $debug;
    }

    /**
     * Get Rosources Path.
     *
     * @return string
     */
    public function getResourcePath()
    {
        return __DIR__ . '/Resources/';
    }

}