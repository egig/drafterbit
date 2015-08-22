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
        $csrfToken = $crawler->filter('input[name="page[_token]"]')->attr('value');
        
        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );

        // Test validatin first
        $param = [
        	'page' => [
        		'id' => 'new',
        		'title' => '',
        		'slug' => '',
        		'status' => 1,
        		'Save' => '',
        		'_token' => $csrfToken
        	]
        ];
        $crawler = $client->request('POST', '/'.static::$admin.'/page/save', $param, array());

        $this->assertEquals(Response::HTTP_INTERNAL_SERVER_ERROR, $client->getResponse()->getStatusCode());
        $json = $client->getResponse()->getContent();
        $arr = json_decode($json,true);
        $this->assertEquals($arr['error']['type'], 'validation');

        $param = [
        	'page' => [
        		'id' => 'new',
        		'title' => 'Foo Bar',
        		'slug' => substr(md5(microtime()),rand(0,26),5),
        		'status' => 1,
        		'Save' => '',
        		//@todo 'layout' => 'default.html.twig',
        		'_token' => $csrfToken
        	]
        ];

        $crawler = $client->request('POST', '/'.static::$admin.'/page/save', $param, array());

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());
        $this->assertEquals('application/json', $client->getResponse()->headers->get('Content-Type'));
	}
}