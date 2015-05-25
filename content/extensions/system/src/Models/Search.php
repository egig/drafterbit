<?php namespace Drafterbit\Extensions\System\Models;

class Search extends \Drafterbit\Base\Model
{
    public function doSearch($q, $queries)
    {
        $results = [];
        
        if ($q) {
            foreach ($queries as $queryFormatter) {

                $query = $queryFormatter[0];
                $query->setParameter(':q', "%$q%");
                $res = $query->getResult();

                $formatter = $queryFormatter[1];

                foreach ($res as $item) {
                    $results[] = [
                        'url' => $formatter['url']($item),
                        'title' => $formatter['title']($item),
                        'summary' => $formatter['summary']($item)
                    ];
                }
            }
        }

        return $results;
    }
}
