<?php


namespace Drafterbit\Bundle\BlogBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Drafterbit\Bundle\BlogBundle\Entity\Post;

class PostRepository extends EntityRepository
{
    /**
     * Get posts by status and category
     *
     * @param string $status
     * @param int $categoryId
     */
    public function getByStatusAndCategory($status, $categoryId = null)
    {
        $query = $this->createQueryBuilder('p')
            ->where("p.type = '".Post::TYPE_STANDARD."'");

        if($categoryId) {
            $query->join('p.categories', 'c', 'WITH', 'c.id = :categoryId ')
                ->setParameter('categoryId', $categoryId);
        }

        if($status == 'trashed') {
            $query->andWhere("p.deletedAt is not null");
        } else {
            $query->andWhere("p.deletedAt is null");
            switch ($status) {
                case 'all':
                    break;
                case 'published':
                    $query->andWhere('p.status = 1');
                    break;
                case 'pending':
                    $query->andWhere('p.status = 0');
                    break;
                default:
                    break;
            }
        }

        return $query->getQuery()->getResult();
    }
}
