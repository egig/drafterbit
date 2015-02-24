<?php namespace Drafterbit\Extensions\System\Widgets;

use Drafterbit\System\Widget\Widget;
use Drafterbit\Extensions\System\FrontendController;

class SearchWidget extends Widget
{
	function getName()
	{
		return 'search';
	}

    public function run($context = null)
    {
        return $this['twig']->render('search/form.html');
    }
}
