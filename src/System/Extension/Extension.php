<?php

namespace Drafterbit\System\Extension;

abstract class Extension implements ExtensionInterface
{
	protected $container;

	/**
	 * The Constructor.
	 *
	 * @param Container
	 */
	public function __construct($container)
	{
		$this->container = $container;
	}
}