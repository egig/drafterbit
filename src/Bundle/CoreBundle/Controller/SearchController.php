<?php

namespace drafterbit\Bundle\CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class SearchController extends Controller
{
    /**
     * @Template("widgets/search/index.html.twig")
     */
    public function searchAction(Request $request)
    {
        $data['q'] = $q = $request->query->get('q', '{no query specified}');

        $results = $this->get('search_engine')->doSearch($q);

        $data['results'] = $results;

        return $data;
    }
}
