<?php

namespace Drafterbit\System\Log;

interface EntityFormatterInterface
{
    public function getName();

    public function format($id);
}
