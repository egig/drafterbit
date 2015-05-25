<?php

namespace Drafterbit\Bundle\BlogBundle\FrontendTemplating;

use Symfony\Component\HttpKernel\Kernel;
use Drafterbit\Bundle\SystemBundle\Twig\Extension\FrontendExtension;

class BlogExtension extends \Twig_Extension
{
    protected $kernel;

    public function __construct(Kernel $kernel)
    {
        $this->kernel = $kernel;
    }

    public function getFunctions()
    {
        return array(
            new \Twig_SimpleFunction('blog_url', array($this, 'blogUrl')),
        );
    }

    public function blogUrl($path)
    {
        $path = trim($path, '/');

        $frontpage = $this->kernel->getContainer()->get('system')->get('frontpage');

        if($frontpage != 'blog') {
            $path = 'blog/'.$path;
        }

        return (new FrontendExtension($this->kernel))->baseUrl($path);
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'drafterbit_blog';
    }
}