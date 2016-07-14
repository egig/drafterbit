<?php

namespace drafterbit\Core\Search;

interface ResultFormatterInterface
{
    /**
     * Format search result item url and return it.
     *
     * @param mixed $item
     */
    public function getUrl($item);

    /**
     * Format search result item title and return it.
     *
     * @param mixed $item
     */
    public function getTitle($item);

    /**
     * Format search result item summary and return it.
     *
     * @param mixed $item
     */
    public function getSummary($item);
}
