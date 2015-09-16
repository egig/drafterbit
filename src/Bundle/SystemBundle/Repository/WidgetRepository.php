<?php


namespace Drafterbit\Bundle\SystemBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Drafterbit\Bundle\BlogBundle\Entity\Post;
use Doctrine\ORM\Query\Expr;

class WidgetRepository extends EntityRepository
{
	public function getByThemePosition($position, $theme)
	{
		$query = $this->createQueryBuilder('w')
            ->where('w.position=:position')
            ->andWhere('w.theme=:theme')
            ->setParameter('position', $position)
            ->setParameter('theme', $theme)
            ->getQuery();

        return $query->getResult();
	}
}