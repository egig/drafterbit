<?php

namespace Drafterbit\Bundle\SystemBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\BrowserKit\Cookie;
use Drafterbit\Test\WebTestCase;

class SettingControllerTest extends WebTestCase
{
	public function testGeneralAction()
	{
		$client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', $this->adminPath('setting/general'));
        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
        $this->assertContains('General', $client->getResponse()->getContent());
        $this->assertContains('setting[_token]', $client->getResponse()->getContent());

        $csrfToken = $crawler->filter('input[name="setting[_token]"]')->attr('value');

        $param = ['setting' => [
        	'_token' => $csrfToken,
        	'system' => [
        			'site_name' => 'foobar'
        		]
        	]
        ];

        $crawler = $client->request(
            'POST',
            '/'.static::$admin.'/setting/general',
            $param,
            array(),
            array('HTTP_X_REQUESTED_WITH' => 'XMLHttpRequest')
        );

        $expected = $this->createAuthorizedClient()->getContainer()
        	->get('system')->get('system.site_name');

        $this->assertTrue($client->getRequest()->isXmlHttpRequest());
        $this->assertEquals($expected, 'foobar');
	}

	public function testThemeAction()
	{
		$client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', '/'.static::$admin.'/setting/theme');
        
        $this->assertContains('Theme', $client->getResponse()->getContent());
	}

	public function testCreateDeletewidget(){

		/* PENDING: Cannot set session ID after the session has started
		$client = $this->getAuthorizedClient();
		
		$csrfToken = $client->getContainer()->get('form.csrf_provider')
			->generateCsrfToken(\Drafterbit\Bundle\SystemBundle\Form\Type\WidgetType::INTENTION);

		// creat new
		$param = [
			'widget' => [
				'_token' => $csrfToken,
				'id' => '',
				'name' => 'text',
				'content' => 'foobar',
				'position' => 'Sidebar',
				'theme' => 'feather',
				'title' => 'foobar',
			]
		];

        $crawler = $client->request('POST', '/'.static::$admin.'/setting/widget/save', $param);

        $this->assertEquals('application/javascript', $client->getResponse()->headers->get('Content-Type'));

        // check create widget
        $param = json_decode($client->getResponse()->getContent());

        $em = $client->getContainer()->get('doctrine')->getManager();
        $widget = $em->getRepository('SystemBundle"Widget')->find($param->id);
        $this->assertTrue($widget instanceof \Drafterbit\Bundle\SystemBundle\Entity\Widget);
        */
	}

	public function testCustomizeThemeAction()
	{
		$client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', $this->adminPath('setting/theme/customize'));

        /// url must be accoumpanied with csrf _token and theme
        $response = $client->getResponse();
        $this->assertTrue($response->isRedirect());	
	}
}