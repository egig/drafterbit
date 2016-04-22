<?php

namespace drafterbit\Bundle\SystemBundle\Repository;

use Doctrine\ORM\EntityRepository;

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
