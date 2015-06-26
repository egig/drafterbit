<?php

namespace Drafterbit\Bundle\SystemBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\BrowserKit\Cookie;

use Drafterbit\Test\Auth;

class SettingControllerTest extends WebTestCase
{
	public static $admin;
	protected $client;

	private function getAuthorizedClient() {
		if(!$this->client) {
			$this->client = Auth::authorizeClient(static::createClient());
		}

		return $this->client;
	}

	public function setUp()
	{
        static::$admin = static::createClient()
        	->getContainer()->getParameter('admin');
	}

	public function testGeneralAction()
	{
		$client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', '/'.static::$admin.'/setting/general');
        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
        $this->assertContains('General', $client->getResponse()->getContent());
	}

	public function testThemeAction()
	{
		$client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', '/'.static::$admin.'/setting/theme');
        
        $this->assertContains('Theme', $client->getResponse()->getContent());
	}

	public function testCustomizeThemeAction()
	{
		$client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', '/'.static::$admin.'/setting/theme/customize');

        /// url must be accoumpanied with csrf _token and theme
        $response = $client->getResponse();
        $this->assertTrue($response->isRedirect());	
	}
}