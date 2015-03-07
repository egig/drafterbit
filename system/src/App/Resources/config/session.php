<?php return [

/**
 * --------------------------------------------------------------------------
 *  Session Default Driver
 * --------------------------------------------------------------------------
 *
 * This is default driver you will use in application. Available driver:
 * native, file, and array. Note that array driver not persist the value across
 * the request, off course. But it's really usefull for testing.
 */

'driver' => 'cookie',

/**
 * --------------------------------------------------------------------------
 *  Session Cookie Lifetime
 * --------------------------------------------------------------------------
 *
 *  Here you may specify the number of seconds that you wish the session
 *  to be allowed to remain idle before it expires. If you want them
 *  to immediately expire when the browser closes set it to zero.
 */

'cookie.lifetime' => 120,

/**
 * --------------------------------------------------------------------------
 *  Session File Location
 * --------------------------------------------------------------------------
 *
 *  When using the native session driver we need a location where session
 *  files may be stored. A default has been set for you but a different
 *  location may be specified.
 */

 'save.path' =>  '%content_dir%/cache/sessions',

/**
 * --------------------------------------------------------------------------
 *  Session Sweeping Lottery
 * --------------------------------------------------------------------------
 *
 *  Some session drivers must manually sweep their storage location to get
 *  rid of old sessions from storage. Here are the chances that it will
 *  happen on a given request.
 */

'gc.probability'     => 2,
'gc.divisor'         => 100,

/**
 * --------------------------------------------------------------------------
 *  Session Cookie Name
 * --------------------------------------------------------------------------
 *
 *  Here you may change the name of the cookie used to identify a session
 *  instance by ID. The name specified here will get used every time a
 *  new session cookie is created by the framework for every driver.
 */

'session.name' => 'dt_session'

];
