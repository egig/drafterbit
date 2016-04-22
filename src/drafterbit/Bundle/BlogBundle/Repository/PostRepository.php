<?php

namespace drafterbit\Bundle\BlogBundle\Repository;

use Doctrine\ORM\EntityRepository;
use drafterbit\Bundle\BlogBundle\Entity\Post;
use Doctrine\ORM\Query\Expr;

class PostRepository extends EntityRepository
{
    /**
     * Get tagged posts;.
     */
    public function getStandard($page, $maxResult)
    {
        $query = $this->getPerPageQuery($page, $maxResult);

        return $query->getQuery()->getResult();
    }

    /**
     * Get tagged posts;.
     */
    public function getByTag($tag, $page, $maxResult)
    {
        $query = $this->getPerPageQuery($page, $maxResult);
        $query->innerJoin('p.tags', 't', Expr\Join::WITH, "t.slug = '$tag'");

        return $query->getQuery()->getResult();
    }

    /**
     * Get by category.
     */
    public function getByCategory($category, $page, $maxResult)
    {
        $query = $this->getPerPageQuery($page, $maxResult);
        $query->innerJoin('p.categories', 'c', Expr\Join::WITH, "c.slug = '$category'");

        return $query->getQuery()->getResult();
    }

    /**
     * Get by author.
     */
    public function getByAuthor($author, $page, $maxResult)
    {
        $query = $this->getPerPageQuery($page, $maxResult);
        $query->innerJoin('p.user', 'u', Expr\Join::WITH, "u.username = '$author'");

        return $query->getQuery()->getResult();
    }

    /**
     * Get standard post per limit.
     *
     * @param int $page
     * @param int $maxResult
     *
     * @return array
     */
    private function getPerPageQuery($page, $maxResult)
    {
        $offset = ($page * $maxResult) - $maxResult;

        $query = $this->createQueryBuilder('p')
            ->where("p.type = '".Post::TYPE_STANDARD."'")
            ->setMaxResults($maxResult)
            ->setFirstResult($offset);

        return $query;
    }

    /**
     * Get posts by status and category.
     *
     * @param string $status
     * @param int    $categoryId
     */
    public function getByStatusAndCategory($status, $categoryId = null)
    {
        $query = $this->createQueryBuilder('p')
            ->where("p.type = '".Post::TYPE_STANDARD."'");

        if ($categoryId) {
            $query->join('p.categories', 'c', 'WITH', 'c.id = :categoryId ')
                ->setParameter('categoryId', $categoryId);
        }

        if ($status == 'trashed') {
            $query->andWhere('p.deletedAt is not null');
        } else {
            $query->andWhere('p.deletedAt is null');
            switch ($status) {
                case 'all':
                    break;
                case 'published':
                    $query->andWhere('p.status = '.Post::STATUS_PUBLISHED);
                    break;
                case 'pending':
                    $query->andWhere('p.status = '.Post::STATUS_PENDING);
                    break;
                default:
                    break;
            }
        }

        return $query->getQuery()->getResult();
    }

    /**
     * Get post history.
     *
     * @param int $postId
     */
    public function getHistories($postId)
    {
        $query = $this->createQueryBuilder('p')
        ->where('p.type  = :type')
        ->setParameter('type', 'history:'.$postId)
        ->getQuery();

        return $query->getResult();
    }
}
