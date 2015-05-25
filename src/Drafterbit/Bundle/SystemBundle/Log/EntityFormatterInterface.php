<?php

namespace Drafterbit\Bundle\SystemBundle\Log;

interface EntityFormatterInterface {

	public function getName();

	public function format($id);
}