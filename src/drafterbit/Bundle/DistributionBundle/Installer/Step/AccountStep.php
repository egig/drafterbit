<?php

namespace drafterbit\Bundle\DistributionBundle\Installer\Step;

use drafterbit\Bundle\DistributionBundle\Installer\Form\AccountStepType;

class AccountStep implements StepInterface
{
    private $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function getFormType()
    {
        return AccountStepType::class;
    }

    /**
     * @see StepInterface
     */
    public function getTemplate()
    {
        return 'DistributionBundle:Step:account.html.twig';
    }

    public function process($data, $installer = null)
    {
        $installer->set('account', $data);
    }

    public function isDone()
    {
        return false;
    }
}
