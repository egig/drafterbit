<?php

namespace Drafterbit\Bundle\DistributionBundle\Installer\Step;

interface StepInterface {

    function process($data, $installer = null);
    function isDone();
}