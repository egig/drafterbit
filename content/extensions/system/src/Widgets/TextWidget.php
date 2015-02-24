<?php namespace Drafterbit\Extensions\System\Widgets;

use Drafterbit\System\Widget\Widget;

class TextWidget extends Widget
{
	public function getName()
	{
		return 'text';
	}

    public function run($context = null)
    {
        return $context['content'];
    }

    public function getContextTypes()
    {
    	return [
    		['name' =>'content',
			'label' => 'Content',
			'type' => 'textarea',
			'default' => null ]
		];
    }
}