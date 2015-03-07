<?php namespace Drafterbit\Component\Template;

interface EscaperInterface {

    public function escape($value, $context);
}