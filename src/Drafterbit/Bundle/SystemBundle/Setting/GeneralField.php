<?php

namespace Drafterbit\Bundle\SystemBundle\Setting;

use Drafterbit\System\Setting\Field;
use Drafterbit\Bundle\SystemBundle\Form\Type\SystemType;

class GeneralField extends Field {
	
	public function getForm()
	{
		return
		$this->container->get('form.factory')
			->create(new SystemType($this->container));
	}
}