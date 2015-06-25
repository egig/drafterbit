<?php

namespace Drafterbit\Bundle\SystemBundle\Twig\Extension;

use Symfony\Component\DependencyInjection\Container;
use Drafterbit\Bundle\SystemBundle\DrafterbitSystemBundle;

class DrafterbitSystemExtension extends \Twig_Extension
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
            'version' => \Drafterbit\Drafterbit::VERSION
        ];

        return [ 'system' => $system ];
    }

    public function getFunctions()
    {
        return array(
            new \Twig_SimpleFunction('gravatar_url', array($this, 'getGravatarUrl')),
            new \Twig_SimpleFunction('__', array($this, 'trans'))
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
        return $this->container->getParameter(DrafterbitSystemBundle::NAVIGATION);
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'drafterbit_system';
    }
}