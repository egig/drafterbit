<?php

namespace Drafterbit\Bundle\SystemBundle\Search;

interface ResultFormatterInterface {

    function getUrl($item);
    function getTitle($item);
    function getSummary($item);
}