<?php

namespace Drafterbit\System\Search;

interface ResultFormatterInterface {

    function getUrl($item);
    function getTitle($item);
    function getSummary($item);
}