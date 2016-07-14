<?php

namespace drafterbit\Core\Tests;

use drafterbit\Core\Application;

class ApplicationTest extends \PHPUnit_Framework_testCase
{

    function testRouteResource()
    {
        $da = new AppTestApplication();

        $da->addRouteResources("foo");
        $da->addRouteResources("bar", "xml");

        $da->addRouteResources("baz", "xml");

        $this->assertTrue(array_key_exists("annotation", $da->getRouteResources()));
        $this->assertTrue(array_key_exists("xml", $da->getRouteResources()));
        $this->assertCount(2, $da->getRouteResources()['xml']);
    }
}

class AppTestApplication extends Application
{
    public function getRoutePrefix() {
        return "dummy";
    }
}