<?php

namespace drafterbit\Bundle\BlogBundle\System\Search;

use drafterbit\System\Search\QueryProvider as BaseQueryProvider;
use Symfony\Component\DependencyInjection\Container;

class QueryProvider extends BaseQueryProvider
{
    public function getQuery()
    {
        $tableName = $this->container->get('doctrine')->getManager()
            ->getClassMetadata('BlogBundle:Post')->getTableName();

        $query = $this->databaseConnection->createQueryBuilder()
            ->select('*')
            ->from($tableName, 'p')
            ->where('p.title like :q')
            ->orWhere('p.content like :q')
            ->andWhere("p.type = 'standard'");

        return $query;
    }

    public function getResultFormatter(Container $container = null)
    {
        return new ResultFormatter($container);
    }
}
