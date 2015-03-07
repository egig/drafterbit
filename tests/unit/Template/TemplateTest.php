<?php

use Drafterbit\Component\Template\TemplateManager;

class TemplateTest extends  \Codeception\TestCase\Test
{
    protected function _before()
	{
		$this->tmpl = new TemplateManager(__DIR__);
	}
	
	/**
	 * @expectedException Drafterbit\Component\Template\Exceptions\TemplateNotFoundException
	 */
	function testTemplateLoaded()
	{
		$this->tmpl->render('foo');
	}

	function testTemplateRender()
	{
		$this->expectOutputString('foo');
		echo $this->tmpl->render('test-tpl', array('var' => 'foo'));
	}
}