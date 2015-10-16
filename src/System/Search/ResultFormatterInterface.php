<?php

namespace Drafterbit\System\Search;

interface ResultFormatterInterface {

	/**
	 * Format search result item url and return it.
	 *
	 * @param mixed $item
	 */
    function getUrl($item);

    /**
	 * Format search result item title and return it.
	 *
	 * @param mixed $item
	 */
    function getTitle($item);

    /**
	 * Format search result item summary and return it.
	 *
	 * @param mixed $item
	 */
    function getSummary($item);
}