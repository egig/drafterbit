<?php namespace Drafterbit\Base;

abstract class Model extends Controller {

    /**
     * Namespace origin is helper for namespaceparser
     *
     * @var string
     */
    protected $namespaceOrigin = 'Models';

    /**
     * Helper for create query builder
     *
     * @return \Doctrine\DBAL\Query\QuerBuilder
     */
    public function withQueryBuilder()
    {
        return $this['db']->createQueryBuilder();
    }
}