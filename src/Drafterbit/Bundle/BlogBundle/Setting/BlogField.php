<?php

namespace Drafterbit\Bundle\BlogBundle\Setting;

use Drafterbit\System\Setting\Field;
use Drafterbit\Bundle\BlogBundle\Form\Type\SettingType;

class BlogField extends Field {
	
	public function getForm()
	{
		return
		$this->container->get('form.factory')
			->create(new SettingType($this->container->get('system')));
	}
}