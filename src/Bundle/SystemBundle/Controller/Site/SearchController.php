<?php

namespace Drafterbit\Bundle\SystemBundle\Controller\Site;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class SearchController extends Controller {

    /**
     * @Route("/", name="dt_system_search")
     * @Template("widgets/search/index.html.twig")
     */
    public function searchAction(Request $request)
    {
        $data['q'] = $q = $request->query->get('q');

        if(!$q) {
            throw $this->createNotFoundException();
        }

        $results = $this->get('search_engine')->doSearch($q);

        $data['results'] = $results;
        return $data;
    }
}
