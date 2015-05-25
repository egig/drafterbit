<?php

namespace Drafterbit\Bundle\SystemBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\BrowserKit\Cookie;

class PostControllerTest extends WebTestCase
{
	public static $admin;
    protected $client;
 
    protected function setUp()
    {
        $this->client = static::createClient();
        static::$admin = $this->client->getContainer()->getParameter('admin');
    }

    public function testAdminDashboardRedirect()
    {
        $client = $this->client;

        $crawler = $client->request('GET', '/'.static::$admin);

        $response = $client->getResponse();

        $this->assertTrue($response->isRedirect());
    }

    public function testAdminAuth()
    {
    	$client = $this->createAuthorizedClient();

        $crawler = $client->request('GET', '/'.static::$admin.'/');

        $this->assertEquals(
            Response::HTTP_OK,
            $client->getResponse()->getStatusCode()
        );
    }

    /**
     * Create authorized client
     *
     * @link http://stackoverflow.com/questions/14957807/symfony2-tests-with-fosuserbundle/27223293#27223293
     * @return Client
     */
    protected function createAuthorizedClient()
    {
        $client = $this->client;
        $container = $client->getContainer();

        $session = $container->get('session');
        /** @var $userManager \FOS\UserBundle\Doctrine\UserManager */
        $userManager = $container->get('fos_user.user_manager');
        /** @var $loginManager \FOS\UserBundle\Security\LoginManager */
        $loginManager = $container->get('fos_user.security.login_manager');
        $firewallName = $container->getParameter('fos_user.firewall_name');

        /// @todo create fixture for this
        $testUser = $container->getParameter('test_user');
        $user = $userManager->findUserBy(array('username' => $testUser));
        $loginManager->loginUser($firewallName, $user);

        // save the login token into the session and put it in a cookie
        $container->get('session')->set('_security_' . $firewallName,
            serialize($container->get('security.context')->getToken()));
        $container->get('session')->save();
        $client->getCookieJar()->set(new Cookie($session->getName(), $session->getId()));

        return $client;
    }
}