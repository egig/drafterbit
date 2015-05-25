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
     * Check if request is contains customize mode
     *
     * @param GetResponseEvent $event
     */
    public function onKernelRequest(GetResponseEvent $event)
    {
        $request = $event->getRequest();
        $theme = $request->query->get('theme');
        $token = $request->query->get('_token');

        // change theme path according to theme
        // and add theme context data
        if($theme) {
            if(!$this->isCsrfTokenValid($token)) {
                throw new AccessDeniedException();
            }

            $themesPath = $this->container->getParameter('themes_path');
            $this->container->get('twig.loader')->setPaths($themesPath.'/'.$theme.'/_tpl');

            $context = $this->container->get('system')->get('theme.'.$theme.'.context', '[]');
            foreach (json_decode($context, true) as $key => $value) {
                $this->container->get('twig')->addGlobal($key, $value);
            }
        }
    }

    /**
     * Change twig path on frontend controller
     */
    public function onKernelController(FilterControllerEvent $event)
    {
        $controller = $event->getController();

        if($controller[0] instanceof FrontendController) {

            $theme = $this->container->getParameter('theme');
            $themesPath = $this->container->getParameter('themes_path');
            $this->container->get('twig.loader')->setPaths($themesPath.'/'.$theme.'/_tpl');
            $this->container->get('twig')->disableStrictVariables();
        }
    }

    public static function getSubscribedEvents()
    {
        return array(
            KernelEvents::REQUEST => array('onKernelRequest'),
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