<?php

namespace Drafterbit\Bundle\SystemBundle\Setting;

use Drafterbit\System\Setting\Field;
use Drafterbit\Bundle\SystemBundle\Form\Type\DashboardType;

class DashboardField extends Field {
	
	public function getForm()
	{
		return
		$this->container->get('form.factory')
			->create(new DashboardType($this->container));
	}
}