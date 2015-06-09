<?php

namespace Drafterbit\Bundle\InstallBundle;

use Symfony\Component\DependencyInjection\ContainerInterface;

class Installer
{
	protected $container;
	protected $data = [];

	public function __construct(ContainerInterface $container)
	{
		$this->container = $container;
	}

	public function setData($data) {
		$this->data = $data;
	}

	public function getData() {
		return $this->data;
	}
}