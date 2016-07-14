<?php

namespace drafterbit\Core\Log;

use Symfony\Component\HttpKernel\Kernel;

abstract class BaseEntityFormatter implements EntityFormatterInterface
{
    protected $kernel;

    public function __construct(Kernel $kernel)
    {
        $this->kernel = $kernel;
    }

    public function getKernel()
    {
        return $this->kernel;
    }

    public function getName()
    {
    }

    public function format($id)
    {
    }

    public function getUser()
    {
        $container = $this->kernel->getContainer();

        if (!$container->has('security.token_storage')) {
            throw new \LogicException('The SecurityBundle is not registered in your application.');
        }

        if (null === $token = $container->get('security.token_storage')->getToken()) {
            return;
        }

        if (!is_object($user = $token->getUser())) {
            // e.g. anonymous authentication
            return;
        }

        return $user;
    }
}
