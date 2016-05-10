<?php

namespace drafterbit\Bundle\CoreBundle\EventListener;

use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class CLIResponseListener  implements EventSubscriberInterface
{
    /**
     * Turn of web profiler on preview.
     */
    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        if (php_sapi_name() == 'cli') {
            $exception = $event->getException();

            $statusCode = 500;
            if ($exception instanceof HttpExceptionInterface) {
                $statusCode = $exception->getStatusCode();
            }

            $event->setResponse(new Response($exception->getMessage(), $statusCode));
        }
    }

    public static function getSubscribedEvents()
    {
        return [KernelEvents::EXCEPTION => array('onKernelException')];
    }
}
