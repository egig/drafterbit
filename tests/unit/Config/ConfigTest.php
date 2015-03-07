<?php

use Drafterbit\Component\Config\Config;


class ConfigTest extends \Codeception\TestCase\Test
{
    /**
     * @var \UnitTester
     */
    protected $tester;

    protected function _before()
    {
        $this->config = new Config(__DIR__ . '/test-path');
    }

    protected function _after()
    {
    }

    public function testValue()
    {
        $this->assertEquals('baz', $this->config['config.foo'][1]);
    }

    public function testDeferredPath()
    {
        $deferredPath = __DIR__ . '/test-deferred-path';
        $this->config->setDeferredPath('unit-test', $deferredPath);

        $this->assertEquals('bar', $this->config['config.foo@unit-test']);
    }

}