<?php

namespace Drafterbit\System\FrontPage;

use Symfony\Component\Routing\Route;

interface FrontPageInterface
{
	/**
	 * Route prefix will be used if its not used as front page
	 *
	 * @return string
	 */
	public function getRoutePrefix();

	/**
	 * Get app oute collection
	 *
	 * @return RouteCollection
	 */
	public function getRoutes();

	/**
	 * Get option for frontpage setting
	 *
	 * @return array
	 */
	public function getOptions();
}