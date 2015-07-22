<?php

namespace Drafterbit\Bundle\PageBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\Response;
use Drafterbit\Test\WebTestCase;

class PageControllerTest extends WebTestCase
{
	public function testIndexAction()
	{
		$client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', $this->adminPath('user'));

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
        $this->assertContains('Page', $client->getResponse()->getContent());
	}

	public function testDataAction()
	{
		$client = $this->getAuthorizedClient();
        $crawler = $client->request('GET', $this->adminPath('page/data/all'));
        $this->assertEquals('application/json', $client->getResponse()->headers->get('Content-Type'));
	}

	public function testEditAction()
	{
		$client = $this->getAuthorizedClient();
        $crawler = $client->request('GET', $this->adminPath('page/edit/new'));
        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
	}
}