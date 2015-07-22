<?php

namespace Drafterbit\System\Search;

use Doctrine\DBAL\Query\QueryBuilder;
use Symfony\Component\DependencyInjection\Container;

class Engine {

    protected $queryProviders = [];
    protected $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * Do a search
     */
    public function doSearch($q)
    {
        $results = [];

        $queryProviders = $this->getQueryProviders();

        if ($q) {
            foreach ($queryProviders as $queryProvider) {

                $query = $queryProvider->getQuery();

                if(!$query instanceof QueryBuilder) {
                    throw new \LogicException("Method getQuery of".get_class($queryProvider).
                        " must return an instance of Doctrine\DBAL\Query\QueryBuilder");
                }

                $resultFormatter = $queryProvider->getResultFormatter($this->container);

                $query->setParameter(':q', "%$q%");
                $res = $query->execute()->fetchAll();

                foreach ($res as $item) {
                    $results[] = $this->format($item, $resultFormatter);
                }
            }
        }

        return $results;
    }

    private function format($item, ResultFormatterInterface $formatter)
    {
        return [
            'url' => $formatter->getUrl($item),
            'title' => $formatter->getTitle($item),
            'summary' => $formatter->getSummary($item)
        ];
    }

    public function getQueryProviders()
    {
        return $this->queryProviders;
    }

    public function addQueryProvider(QueryProvider $queryProvider)
    {
        $this->queryProviders[] = $queryProvider;
    }
}