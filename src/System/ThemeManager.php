<?php

namespace drafterbit\System;

class ThemeManager {

	/**
	 * Registered themes path
	 *
	 * @var string
	 **/
	private $themesPath = [];

	/**
	 * The Constructor.
	 *
	 * @return void
	 * @author Egi Gundari <egigundari@gmail.com>
	 **/
	public function __construct()
	{
		$this->themesPath[] = \drafterbit\Drafterbit::getCoreThemePath();
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
