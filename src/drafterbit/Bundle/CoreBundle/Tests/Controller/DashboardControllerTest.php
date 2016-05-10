<?php

namespace drafterbit\Bundle\CoreBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\BrowserKit\Cookie;

use drafterbit\Test\WebTestCase;

class DashboardControllerTest extends WebTestCase
{
    public function testDashboardEditAction()
    {
        $client = $this->getAuthorizedClient();

        $testPanel = 'Log';
        $url = $this->adminPath('system/dashboard/edit/'.$testPanel);
        $crawler = $client->request('GET', $url);
        $this->assertEquals('200', $client->getResponse()->getStatusCode());
        $this->assertTrue($client->getResponse()->isOK());


        $this->assertContains('Edit Panel', $client->getResponse()->getContent());

        $csrfToken = $crawler->filter('input[name="panel[_token]"]')->attr('value');
        $param = [
            'panel' => [
                'id' => 'Log',
                'context' => ['num' => 5],
                'position' => 'left',
                'title'   => 'Test Log Panel',
                '_token'  => $csrfToken
            ]
        ];

        $crawler = $client->request('POST', $url, $param);
        $this->assertTrue($client->getResponse()->isOK());
        $this->assertContains('json', $client->getResponse()->headers->get('Content-Type'));

        $jsonResponse = json_decode($client->getResponse()->getContent());

        $panelId = $jsonResponse->data->id;

        $container = $client->getContainer();
        $panel = $container->get('doctrine')->getManager()
            ->getRepository('CoreBundle:Panel')->find($panelId);

        $this->assertEquals($panelId, $panel->getId());

        return $panelId;
    }

    /**
     * @depends testDashboardEditAction
     */
    public function testDashboardDeleteAction($id)
    {
        $client = $this->getAuthorizedClient();
        $url = $this->adminPath('system/dashboard/delete');
        $param = ['id' => $id];
        $crawler = $client->request('POST', $url, $param);

        $this->assertTrue($client->getResponse()->isOK());
    }
}
