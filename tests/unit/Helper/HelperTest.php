<?php

use Drafterbit\Component\Helper\HelperManager;

class HelperTest extends \Codeception\TestCase\Test
{
	public function testHelperLoaded()
	{
		$helper = new HelperManager;

		$helper->register('string', __DIR__.'/../../../system/src/Base/Resources/helpers/string.php');
		$helper->load('string');
		
		$testArr = array('foo' => array('bar'=>'baz'));
		$this->assertEquals('helper_test', snake_case('helperTest'));
	}
}