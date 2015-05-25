<?php

namespace Drafterbit\Bundle\SystemBundle\Security\Authorization;

class Configuration
{
	protected $adminGroupName = 'Administrator';

	public function getAdminGroupName()
	{
		return $this->adminGroupName;
	}

	public function setAdminGroupName($adminGroupName)
	{
		$this->adminGroupName = $adminGroupName;
	}
}