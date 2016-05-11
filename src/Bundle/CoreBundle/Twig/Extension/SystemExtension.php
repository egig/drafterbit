<?php

namespace drafterbit\Bundle\CoreBundle\Twig\Extension;

use Symfony\Component\DependencyInjection\Container;
use drafterbit\Bundle\CoreBundle\CoreBundle;

class SystemExtension extends \Twig_Extension implements \Twig_Extension_GlobalsInterface
{
    protected $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    public function getGlobals()
    {
        $model = $this->container->get('system');

        $system = [
            'navigations' => $this->getNavigations(),
            'sitename' => $model->get('system.site_name'),
            'tagline' => $model->get('system.site_description'),
            'version' => \drafterbit\Drafterbit::VERSION,
        ];

        return ['system' => $system, 'theme' => $model->get('theme.active')];
    }

    public function getFunctions()
    {
        return array(
            new \Twig_SimpleFunction('gravatar_url', array($this, 'getGravatarUrl')),
            new \Twig_SimpleFunction('__', array($this, 'trans')),
        );
    }

    public function trans($string, $var = [])
    {
        return $this->container->get('translator')->trans($string, $var);
    }

    public function getGravatarUrl($email, $size = 47)
    {
        $hash = md5(strtolower($email));

        return "http://www.gravatar.com/avatar/$hash?d=mm&s=$size";
    }

    /**
     * @todo move this to tagged services
     */
    private function getNavigations()
    {
        return $this->container->getParameter(CoreBundle::NAVIGATION);
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'dt_system';
    }
}
