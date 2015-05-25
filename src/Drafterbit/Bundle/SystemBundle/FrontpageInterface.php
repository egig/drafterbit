<?php

namespace Drafterbit\Bundle\SystemBundle;

use Symfony\Component\Routing\Route;

interface FrontpageInterface
{
	public function getName();

	public function resolve($key);

	public function getType();

	public function  getRoute();
}