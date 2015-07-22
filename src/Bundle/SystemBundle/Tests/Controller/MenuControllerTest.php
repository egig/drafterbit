<?php

namespace Drafterbit\Bundle\SystemBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\BrowserKit\Cookie;

use Drafterbit\Test\WebTestCase;

class MenuControllerTest extends WebTestCase
{
	public function testIndexAction()
	{
		$client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', '/'.static::$admin.'/menu');

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
        $this->assertContains('Menus', $client->getResponse()->getContent());
	}
}