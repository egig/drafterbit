<?php

namespace drafterbit\Bundle\CoreBundle\Tests\Monolog\Handler;

use drafterbit\Test\WebTestCase;

class DoctrineDBALHandlerTest extends WebTestCase
{
    public function testWrite()
    {
        $client = static::createClient();
        $container = $client->getContainer();

        $testMessage = "dt_test_message";
        // Dbal log handler only log info, check config.yml
        // We are gonna log dummy message the check weather
        // the message exsists or not then delete it
        $logger = $container->get('monolog.logger.user_activity');
        $logger->info($testMessage, ['foo'=> 'bar']);

        $repo = $container->get('doctrine')->getRepository('CoreBundle:Log');

        $queryBuilder = $repo->createQueryBuilder('l')->where("l.message = '$testMessage'");
        $result = $queryBuilder->getQuery()->getResult();
        $log = $result[0];

        $this->assertEquals($log->getMessage(), $testMessage);
        $this->assertEquals(json_decode($log->getContext(), true)['foo'], 'bar');

        $em = $container->get('doctrine')->getManager();
        $em->remove($log);
        $em->flush();
    }
}