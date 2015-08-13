<?php

namespace Drafterbit\Bundle\SystemBundle\System\Shortcuts;

use Drafterbit\System\Extension\Shortcut;

class AppearanceShortcut extends Shortcut {
	
	public function getUrl()
	{
		$param = [
			'theme' => $this->container->getParameter('theme'),
			'_token' => $this->container->get('form.csrf_provider')->generateCsrfToken('customize_theme')
		];
		return $this->container->get('router')->generate('drafterbit_setting_theme_customize', $param);
	}

	public function getText()
	{
		return "Customize";
	}

	public function getIconClass()
	{
		return 'fa fa-desktop';
	}
}