<?php

namespace drafterbit\System\Tests;

use drafterbit\System\ThemeManager;
use drafterbit\Drafterbit;

class ThemeManagerTest extends \PHPUnit_Framework_testCase
{
	function testThemesPathContainCore() {

		$tm  = new  ThemeManager();

		$this->assertTrue(in_array(Drafterbit::getCoreThemePath(), $tm->getPaths()));
	}

	function testAddPath() {
		
		$tm  = new  ThemeManager();
		$tm->addPath('foo');

		$this->assertTrue(in_array('foo', $tm->getPaths()));
		$this->assertCount(2, $tm->getPaths());
	}
}
