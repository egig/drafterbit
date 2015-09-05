<?php

namespace Drafterbit\Bundle\BlogBundle\Tests\Repository;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class PostRepositoryTest extends KernelTestCase
{
    /**
     * @var \Doctrine\ORM\EntityManager
     */
    private $em;

    /**
     * {@inheritDoc}
     */
    public function setUp()
    {
        self::bootKernel();
        $this->em = static::$kernel->getContainer()
            ->get('doctrine')
            ->getManager()
        ;
    }

    /**
     * @dataProvider getParam
     * 
     */
    public function testGetByStatusAndCategory($status, $cat, $count)
    {
        $posts = $this->em
            ->getRepository('BlogBundle:Post')
            ->getByStatusAndCategory($status, $cat);

        $this->assertCount($count, $posts);
    }

    function getParam()
    {
        // Uses existed Doctrine ORM fixtures
        return [
            ['all', 1, 1],
            ['all', NULL, 1],
            ['published', 1, 1],
            ['published', NULL, 1],
            ['trashed', NULL, 0],
            ['pending', NULL, 0],
        ];
    }

    /**
     * {@inheritDoc}
     */
    protected function tearDown()
    {
        parent::tearDown();
        $this->em->close();
    }
}