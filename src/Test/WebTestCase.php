<?php

namespace drafterbit\Test;

use Symfony\Component\BrowserKit\Client;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase as BaseTestCase;

abstract class WebTestCase extends BaseTestCase
{
    public static $admin;
    protected $client;

    public function setUp()
    {
        static::$admin = static::createClient()
            ->getContainer()->getParameter('admin');
    }

    protected function getAuthorizedClient()
    {
        if (!$this->client) {
            $this->client = $this->createAuthorizedClient();
        }

        return $this->client;
    }

    protected function createAuthorizedClient()
    {
        return static::authorizeClient(static::createClient());
    }

    /**
     * Create admin path.
     *
     * @return string
     */
    protected function adminPath($path)
    {
        return '/'.static::$admin.'/'.trim($path, '/');
    }

    /**
     * Create authorized client.
     *
     * @link http://stackoverflow.com/questions/14957807/symfony2-tests-with-fosuserbundle/27223293#27223293
     *
     * @return Client
     */
    public static function authorizeClient(Client $client)
    {
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
        $token = $container->get('security.token_storage')->getToken();
        $session->set('_security_'.$firewallName, serialize($token));
        $session->save();
        $cookie = new Cookie($session->getName(), $session->getId());
        $client->getCookieJar()->set($cookie);

        return $client;
    }
}
