<?php

namespace Drafterbit\System\FrontPage;

use Symfony\Component\Routing\Route;

interface FrontPageInterface
{
    public function getName();

    public function resolve($key);

    public function getType();

    public function  getRoute();
}