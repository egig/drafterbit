<?php

namespace drafterbit\Bundle\CoreBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\BrowserKit\Cookie;

use drafterbit\Test\WebTestCase;

class AssetControllerTest extends WebTestCase
{

    public function testDtJsAction()
    {
        $client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', '/'.static::$admin.'/asset/js/dt.js');

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
        $this->assertEquals('application/javascript', $client->getResponse()->headers->get('Content-Type'));
    }
}