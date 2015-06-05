<?php

namespace Drafterbit\Bundle\SystemBundle\EventListener;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Drafterbit\Bundle\SystemBundle\Controller\FrontendController;

class FrontendListener implements EventSubscriberInterface
{
    /**
     * @var ContainerInterface
     */
    protected $container;

    /**
     * Constructor.
     *
     * @param ContainerInterface $container The service container instance
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * Change twig path on frontend controller
     */
    public function onKernelController(FilterControllerEvent $event)
    {
        $controller = $event->getController();
        $request = $event->getRequest();

        if($controller[0] instanceof FrontendController) {

            // change theme path according to theme
            // and add theme context data
            if($theme = $request->query->get('theme')) {

                $token = $request->query->get('_token');
                if(!$this->isCsrfTokenValid($token)) {
                    throw new AccessDeniedException();
                }

            } else {
                $theme = $this->container->getParameter('theme');
            }

            $themesPath = $this->container->getParameter('themes_path');

            // prepend theme path
            $this->container->get('twig.loader')->prependPath($themesPath.'/'.$theme.'/_tpl');

            if(!in_array($this->container->getParameter('kernel.environment'), ['dev', 'test'])) {
                $this->container->get('twig')->disableStrictVariables();
            }

            // add global theme context
            $context = $this->container->get('system')->get('theme.'.$theme.'.context', '[]');
            foreach (json_decode($context, true) as $key => $value) {
                $this->container->get('twig')->addGlobal($key, $value);
            }

        } else {

            // restrict some browser
            if(preg_match('/(?i)msie [1-9]/', $request->server->get('HTTP_USER_AGENT'))) {
                // if IE<=9
                exit('Browser not supported yet, sorry. :(');
            }
        }
    }

    public static function getSubscribedEvents()
    {
        return array(
            KernelEvents::CONTROLLER => array('onKernelController')
        );
    }

    private function isCsrfTokenValid($token)
    {
        if (!$this->container->has('security.csrf.token_manager')) {
            throw new \LogicException('CSRF protection is not enabled in your application.');
        }

        $id = 'customize_theme';
        return $this->container->get('security.csrf.token_manager')->isTokenValid(new CsrfToken($id, $token));
    }
}