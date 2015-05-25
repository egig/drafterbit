<?php namespace Drafterbit\Extensions\System\Controllers;

use Drafterbit\Base\Controller\Frontend as FrontendController;

class Frontend extends FrontendController
{
    public function search()
    {
        $data['q'] = $q = $this['input']->get('q');
        $f = $this['input']->get('f');

        $model = $this->model('@system\Search');

        $extensions = $this['extension']->all();

        $queries = [];
        foreach ($extensions as $extension) {
            if (method_exists($extension, 'getSearchQuery')) {
                list($query, $formatter) = $extension->getSearchQuery();
                $queries[] = [$query, $formatter];
            }
        }

        $results = $model->doSearch($q, $queries);

        $data['results'] = $results;
        return $this->render('widgets/search/index', $data);
    }
}
