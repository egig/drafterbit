<?php namespace Drafterbit\Extensions\System\Widgets;

use Drafterbit\Base\Widget\Widget;
use Drafterbit\Base\Controller\Frontend as FrontendController;

class SearchWidget extends Widget
{
    function getName()
    {
        return 'search';
    }

    public function run($context = null)
    {
        return $this['twig']->render('widgets/search/form.html');
    }
}
