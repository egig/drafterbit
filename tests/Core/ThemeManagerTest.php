<?php

namespace drafterbit\Core\Tests;

use drafterbit\Core\ThemeManager;
use drafterbit\Drafterbit;

class ThemeManagerTest extends \PHPUnit_Framework_testCase
{
	function testThemesPathContainCore() {

		$tm  = new  ThemeManager();

		$this->assertTrue(in_array(Drafterbit::getCoreThemePath(), $tm->getPaths()));
	}

	function testAddPath() {
		
		$tm  = new  ThemeManager();
		$tm->addPath(__DIR__.'/../themes_testpath');

		$this->assertTrue(in_array(__DIR__.'/../themes_testpath', $tm->getPaths()));
		$this->assertCount(2, $tm->getPaths());
	}
}
