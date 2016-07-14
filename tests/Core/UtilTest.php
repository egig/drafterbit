<?php

namespace drafterbit\Core\Tests;
use drafterbit\Core\Util;

class UtilTest extends \PHPUnit_Framework_TestCase
{
	function testDot()
	{
		$arr = [
			'foo' => [
				'bar' => 'baz'
			]
		];

		$arrDot = Util::dot($arr);

		$this->assertTrue(array_key_exists('foo.bar', $arrDot));
		$this->assertEquals($arrDot['foo.bar'], 'baz');
	}

	function testEncodeImage() {

		$base64 = Util::encodeImage(__DIR__."/../var/batman.jpeg");

		$this->assertContains("data:image/jpeg;base64", $base64);
	}
}
