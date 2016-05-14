<?php

namespace drafterbit\System\Tests;
use drafterbit\System\ApplicationManager;
use drafterbit\System\Application;

class ApplicationManagerTest extends \PHPUnit_Framework_testCase
{

    function testHasPrefix()
    {
        $am = new ApplicationManager;
        $this->assertCount(0, $am->getRoutes());

        $am->register(new DummyApplication());

        $this->assertTrue($am->hasPrefix("dummy"));
        $this->assertCount(1, $am->getRoutes());
    }
}

class DummyApplication extends Application
{
    public function getRoutePrefix() {
        return "dummy";
    }
}