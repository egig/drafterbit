<?php

namespace drafterbit\Core;

use Symfony\Component\Finder\Finder;

class ThemeManager {

	/**
	 * Registered themes path.
	 *
	 * @var string
	 **/
	private $themesPath = [];

	/**
	 * Initialized themes path.
	 *
	 * @var array
	 **/
	private $paths = [];

	/**
	 * The Constructor.
	 *
	 * @return void
	 * @author Egi Gundari <egigundari@gmail.com>
	 **/
	public function __construct()
	{
		$this->themesPath[] = \drafterbit\Drafterbit::getCoreThemePath();

		$this->initialize();
	}

	/**
	 * Initialize themes path.
	 *
	 * @return void
	 * @author Egi Gundari <egigundari@gmail.com>
	 **/
	private function initialize()
	{
		$this->paths = [];

		foreach ($this->themesPath as $path) {

			$it = (new Finder)->in($path)->directories();

			foreach ($it as $dir) {
				$this->paths[$dir->getFileName()]  = $dir->getRealPath();
			}
		}
	}

	/**
	 * Get Path by name
	 *
	 * @return string
	 **/
	public function getPath($name)
	{
		if (isset($this->paths[$name])) {
			return $this->paths[$name];
		}

		throw new \Exception("Theme $name not existed");
	}

	/**
	 * Add path
	 *
	 * @param string path
	 * @return void
	 * @author Egi Gundari <egigundari@gmail.com>
	 **/
	public function addPath($path)
	{
		// @todo validate theme path, is there theme name collision etc

		$this->themesPath[] = $path;

		$this->initialize();
	}

	/**
	 * Get registered path;
	 *
	 * @return array
	 **/
	public function getPaths()
	{
		return $this->themesPath;
	}
}
