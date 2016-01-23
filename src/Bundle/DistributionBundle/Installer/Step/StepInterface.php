<?php

namespace Drafterbit\Bundle\DistributionBundle\Installer\Step;

interface StepInterface
{
    public function process($data, $installer = null);
    public function isDone();
}
