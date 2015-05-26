<?php

namespace Drafterbit\Bundle\SystemBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class FrontendController extends Controller {

	/**
	 * @Template("widgets/search/index.html")
	 */
	public function searchAction(Request $request)
    {
        $data['q'] = $q = $request->query->get('q');

        $results = $this->get('search_engine')->doSearch($q);

        $data['results'] = $results;
        return $data;
    }
}