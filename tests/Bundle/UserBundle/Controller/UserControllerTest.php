<?php

namespace drafterbit\Bundle\UserBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\Response;
use drafterbit\Test\WebTestCase;

class UserControllerTest extends WebTestCase
{
    public function testIndexAction()
    {
        $client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', $this->adminPath('user'));

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
        $this->assertContains('User', $client->getResponse()->getContent());
    }

    public function testDataAction()
    {
        $client = $this->getAuthorizedClient();
        $crawler = $client->request('GET', $this->adminPath('user/data'));
        $this->assertEquals('application/json', $client->getResponse()->headers->get('Content-Type'));
    }

    public function testEditAction()
    {
        $client = $this->getAuthorizedClient();
        $crawler = $client->request('GET', $this->adminPath('user/edit/new'));
        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());
    }

    public function testValidation()
    {
        $client = $this->getAuthorizedClient();
        $crawler = $client->request('GET', $this->adminPath('user/edit/new'));
        $csrfToken = $crawler->filter('input[name="user[_token]"]')->attr('value');

        // Test validatin first
        $user = [
            '_token' => $csrfToken,
            'bio'=> '',
            'url'=> '',
            'email'=> '',
            'enabled'=> '',
            'id'=> 'new',
            'password' => [
                'first' => '',
                'second' => '',
            ],
            'realname'=> '',
            'username'=> '',
        ];

        $param['user'] = $user;

        $crawler = $client->request('POST', '/'.static::$admin.'/user/save', $param, array());

        $this->assertTrue($client->getResponse()->isOK());
        $json = $client->getResponse()->getContent();
        $arr = json_decode($json,true);
        $this->assertEquals($arr['error']['type'], 'validation');
    }

    public function testSaveAction()
    {
        $client = $this->getAuthorizedClient();
        $crawler = $client->request('GET', $this->adminPath('user/edit/new'));
        $csrfToken = $crawler->filter('input[name="user[_token]"]')->attr('value');

        // Test the save
         $user = [
            '_token' => $csrfToken,
            'bio'=> '',
            'url'=> '',
            'email'=> 'johndoe@example.com',
            'enabled'=> '',
            'id'=> 'new',
            'password' => [
                'second' => 'test123',
                'first' => 'test123',
            ],
            'realname'=> 'John Doe',
            'username'=> 'jdoe',
        ];

        $param['user'] = $user;
        $crawler = $client->request('POST', '/'.static::$admin.'/user/save', $param, array());

        $this->assertTrue($client->getResponse()->isOK());
        $this->assertEquals('application/json', $client->getResponse()->headers->get('Content-Type'));
        $json = $client->getResponse()->getContent();
        $arr = json_decode($json,true);
        $this->assertFalse(isset($arr['error']));

        // clean up
        $container = $client->getContainer();
        $em = $container->get('doctrine')->getManager();
        $repo = $em->getRepository('UserBundle:User');
        $user = $repo->findOneBy(['username' => 'jdoe']);
        $em->remove($user);
        $em->flush();
    }
}
