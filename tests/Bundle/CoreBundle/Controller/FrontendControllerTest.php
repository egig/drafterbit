<?php

namespace drafterbit\Bundle\CoreBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\BrowserKit\Cookie;

use drafterbit\Test\WebTestCase;

class FrontendControllerTest extends WebTestCase
{
    public function testSearchAction()
    {
        $client = $this->getAuthorizedClient();
        $crawler = $client->request('GET', '/search/');
        $this->assertEquals(Response::HTTP_NOT_FOUND, $client->getResponse()->getStatusCode() );
        $crawler = $client->request('GET', '/search/', ['q' => 'foo']);
        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
    }
}