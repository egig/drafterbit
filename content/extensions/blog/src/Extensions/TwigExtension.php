<?php namespace Drafterbit\Blog\Extensions;

use Twig_Extension;
use Twig_SimpleFunction;

class TwigExtension extends Twig_Extension
{
    function getName()
    {
        return 'drafterbit_blog';
    }

    function getFunctions()
    {
        return [
            new Twig_SimpleFunction(
                'comment',
                function($id) {
                    return comment($id);
                }
            ),
        ];
    }
}
