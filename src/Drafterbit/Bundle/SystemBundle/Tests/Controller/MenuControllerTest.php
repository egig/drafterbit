<?php

namespace Drafterbit\Bundle\SystemBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\BrowserKit\Cookie;

use Drafterbit\Test\Auth;

class MenuControllerTest extends WebTestCase
{
	static $admin;
	protected $client;

	public function setUp()
	{
        static::$admin = static::createClient()
        	->getContainer()->getParameter('admin');
	}

	private function getAuthorizedClient() {
		if(!$this->client) {
			$this->client = Auth::authorizeClient(static::createClient());
		}

		return $this->client;
	}

	public function testIndexAction()
	{
		$client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', '/'.static::$admin.'/menu');

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
        $this->assertContains('Menus', $client->getResponse()->getContent());
	}
}