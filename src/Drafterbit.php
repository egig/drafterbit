<?php

namespace drafterbit;

class Drafterbit
{
    const VERSION = '0.4.0';
    const MAJOR_VERSION = 0;
    const MINOR_VERSION = 4;
    const RELEASE_VERSION = 0;
    const EXTRA_VERSION = 'DEV';

    const END_OF_MAINTENANCE = null;
    const END_OF_LIFE = null;

    /**
     * Get core themes path. Default relative to this file.
     *
     * @return string
     * @author 
     **/
 	public static function getCoreThemePath() {

 		return dirname(__DIR__).'/themes';
 	}
}
