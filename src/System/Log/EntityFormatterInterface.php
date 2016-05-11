<?php

namespace drafterbit\System\Log;

interface EntityFormatterInterface
{
    public function getName();

    public function format($id);
}
