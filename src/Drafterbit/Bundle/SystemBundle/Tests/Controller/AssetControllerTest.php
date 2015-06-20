<?php

namespace Drafterbit\Bundle\SystemBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\BrowserKit\Cookie;

use Drafterbit\Test\Auth;

class AssetControllerTest extends WebTestCase
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

	public function testDtJsAction()
	{
		$client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', '/'.static::$admin.'/asset/js/dt.js');

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
        $this->assertEquals('application/javascript', $client->getResponse()->headers->get('Content-Type'));
	}
}