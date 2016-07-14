<?php

namespace drafterbit\Core\Search;

use Doctrine\DBAL\Query\QueryBuilder;
use Symfony\Component\DependencyInjection\Container;

class Engine
{
    /**
     * The query prviders.
     * 
     * @var array
     */
    protected $queryProviders = [];

    /**
     * The Contrainer.
     *
     * @var Container
     */
    protected $container;

    /**
     * The constructor.
     *
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * Populate the search engine and do the search.
     *
     * @param string $q
     */
    public function doSearch($q)
    {
        $results = [];

        $queryProviders = $this->getQueryProviders();

        if ($q) {
            foreach ($queryProviders as $queryProvider) {
                $query = $queryProvider->getQuery();

                if (!$query instanceof QueryBuilder) {
                    throw new \LogicException('Method getQuery of'.get_class($queryProvider).
                        " must return an instance of Doctrine\DBAL\Query\QueryBuilder");
                }

                $resultFormatter = $queryProvider->getResultFormatter($this->container);

                $query->setParameter(':q', "%$q%");
                $results = $query->execute()->fetchAll();

                foreach ($results as $item) {
                    $results[] = $this->format($item, $resultFormatter);
                }
            }
        }

        return $results;
    }

    /**
     * Form search results used given result formatter.
     *
     * @param object                   $item
     * @param ResultFormatterInterface $formatter
     *
     * @return array
     */
    private function format($item, ResultFormatterInterface $formatter)
    {
        return [
            'url' => $formatter->getUrl($item),
            'title' => $formatter->getTitle($item),
            'summary' => $formatter->getSummary($item),
        ];
    }

    /**
     * Get regitered query providers.
     *
     * @return array
     */
    public function getQueryProviders()
    {
        return $this->queryProviders;
    }

    /**
     * Add a query provider.
     *
     * @param QueryProvider $queryProvider
     */
    public function addQueryProvider(QueryProvider $queryProvider)
    {
        $this->queryProviders[] = $queryProvider;
    }
}
