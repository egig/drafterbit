<?php

namespace drafterbit\Bundle\UserBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\Response;
use drafterbit\Test\WebTestCase;

class GroupControllerTest extends WebTestCase
{
    public function testIndexAction()
    {
        $client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', $this->adminPath('user/group'));

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
        $this->assertContains('Group', $client->getResponse()->getContent());
    }

    public function testDataAction()
    {
        $client = $this->getAuthorizedClient();
        $crawler = $client->request('GET', $this->adminPath('user/group/data/all'));
        $this->assertEquals('application/json', $client->getResponse()->headers->get('Content-Type'));
    }

    public function testEditAction()
    {
        $client = $this->getAuthorizedClient();
        $crawler = $client->request('GET', $this->adminPath('user/group/edit/new'));
        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
    }
}