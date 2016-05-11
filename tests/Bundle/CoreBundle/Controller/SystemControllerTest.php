<?php

namespace drafterbit\Bundle\CoreBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;

use drafterbit\Test\WebTestCase;

class SystemControllerTest extends WebTestCase
{
    public function testUnauthorizedRedirect()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/'.static::$admin);

        $response = $client->getResponse();

        $this->assertTrue($response->isRedirect());
    }

    public function testAdminAuth()
    {
        $client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', '/'.static::$admin.'/');

        $this->assertEquals(
            Response::HTTP_OK,
            $client->getResponse()->getStatusCode()
        );
    }

    public function testDashboard()
    {
        $client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', '/'.static::$admin.'/');

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
        $this->assertContains('Dashboard', $client->getResponse()->getContent());
        $this->assertContains('Logout', $client->getResponse()->getContent());
    }

    public function testLogAction()
    {
        $client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', '/'.static::$admin.'/system/log');

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
        $this->assertContains('Log', $client->getResponse()->getContent());
        $this->assertGreaterThan(0, $crawler->filter('button[name="action"]')->count() );
        $this->assertEquals('Delete', $crawler->filter('button[value="delete"]')->text() );
        $this->assertEquals('Clear', $crawler->filter('button[value="clear"]')->text() );
    }

    public function testLogCSRF()
    {
        $param = array('action' => 'delete');

        // no _token parameter passed
        $client = $this->getAuthorizedClient();

        $crawler = $client->request('POST', '/'.static::$admin.'/system/log', $param, array() );
        $this->assertEquals(Response::HTTP_FORBIDDEN, $client->getResponse()->getStatusCode());

        $crawler = $client->request('GET', '/'.static::$admin.'/system/log');

        $csrfToken = $crawler->filter('input[name="_token"]')->attr('value');
        $param['_token'] = $csrfToken;

        $crawler = $client->request(
            'POST',
            '/'.static::$admin.'/system/log',
            $param,
            array()
        );
        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());
    }

    public function testCacheAction()
    {
        $client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', '/'.static::$admin.'/system/cache');

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
        $this->assertContains('Cache', $client->getResponse()->getContent());
        $this->assertEquals('Renew Cache', $crawler->filter('button[name="renew"]')->text());
    }
}
