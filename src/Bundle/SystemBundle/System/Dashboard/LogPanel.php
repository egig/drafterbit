<?php

namespace Drafterbit\Bundle\SystemBundle\System\Dashboard;

use Drafterbit\System\Dashboard\Panel;

class LogPanel extends Panel {

    public function getView()
    {
        $em = $this->container->get('doctrine')->getManager();
        $logEntities = $em->getRepository('SystemBundle:Log')
            ->createQueryBuilder('l')
            ->OrderBy('l.time', 'desc')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult();

        $logs = array_map(function($log){
            return [
                'time' => (new \DateTime())->setTimestamp($log->getTime()),
                'activity' => $this->container
                    ->get('drafterbit_system.log.display_formatter')->format($log->getMessage(), $log->getContext())
            ];
        }, $logEntities);

        return $this->renderView('SystemBundle:Panel:log.html.twig', [
            'logs' => $logs
        ]);
    }

    public function getName()
    {
        return 'log';
    }
}