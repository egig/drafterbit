<?php

namespace Drafterbit\Bundle\BlogBundle\System\Search;

use Drafterbit\System\Search\QueryProvider as BaseQueryProvider;
use Symfony\Component\DependencyInjection\Container;

class QueryProvider extends BaseQueryProvider {

    function getQuery()
    {
        $tableName = $this->container->get('doctrine')->getManager()
            ->getClassMetadata('BlogBundle:Post')->getTableName();

        $query = $this->databaseConnection->createQueryBuilder()
            ->select('*')
            ->from($tableName, 'p')
            ->where("p.title like :q")
            ->orWhere("p.content like :q")
            ->andWhere("p.type = 'standard'");

        return $query;
    }

    function getResultFormatter(Container $container)
    {
        return new ResultFormatter($container);
    }
}
