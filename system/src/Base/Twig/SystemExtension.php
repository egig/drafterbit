<?php namespace Drafterbit\Base\Twig;

use Twig_Extension;
use Twig_SimpleFunction;

class SystemExtension extends Twig_Extension
{
    function getName()
    {
        return 'dt_system';
    }

    function getFunctions()
    {
        $system = app('extension')->get('system')->model('System');

        return array_map(function($v) {
            return new Twig_SimpleFunction($v[0], $v[1]);
        },[
            ['widget', [$system, 'widget']],
            ['menus', [$system, 'menus']],
            ['base_url', 'base_url'],
            ['theme_url', 'theme_url'],
            ['blog_url', 'blog_url'],
            ['__', '__']
        ]);
    }

    function getGlobals()
    {
        return [
            'app' => app(),
            'csrfToken' => csrf_token()
        ];
    }
}