<?php

namespace Drafterbit\Bundle\FileBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\Response;
use Drafterbit\Test\WebTestCase;

class FileControllerTest extends WebTestCase
{
    public function testIndexAction()
    {
        $client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', $this->adminPath('file'));

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
        $this->assertContains('File', $client->getResponse()->getContent());
    }

    public function testDataAction()
    {
        $client = $this->getAuthorizedClient();
        $crawler = $client->request('GET', $this->adminPath('file/data'));
        $this->assertEquals('application/json', $client->getResponse()->headers->get('Content-Type'));
    }
}