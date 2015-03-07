<?php namespace Drafterbit\Extensions\System\Widgets;

use Drafterbit\App\Widget\Widget;
use Drafterbit\Extensions\System\FrontendController;

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
