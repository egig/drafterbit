<?php

namespace drafterbit\Bundle\DistributionBundle\Installer\Step;

use drafterbit\Bundle\DistributionBundle\Installer\Form\SiteStepType;

class SiteStep implements StepInterface
{
    private $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function getFormType()
    {
        return SiteStepType::class;
    }

    public function getTemplate()
    {
        return 'DistributionBundle:Step:site.html.twig';
    }

    public function validate($data)
    {
        return [];
    }

    public function process($data, $installer = null)
    {
        $installer->set('site', $data);
    }

    public function isDone()
    {
        return false;
    }
}
