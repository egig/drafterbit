<?php

namespace Drafterbit\Bundle\SystemBundle\Log;

use Symfony\Component\HttpKernel\Kernel;

abstract class BaseEntityFormatter implements EntityFormatterInterface  {

	protected $kernel;

	public function __construct(Kernel $kernel)
	{
		$this->kernel = $kernel;
	}

	public function getKernel()
	{
		return $this->kernel;
	}

	public function getName() {}

	public function format($id) {}
}