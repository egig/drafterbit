<?php

namespace Drafterbit\Bundle\SystemBundle\Dashboard;

use Drafterbit\System\Dashboard\Panel;

class LogPanel extends Panel {

    public function getView()
    {
        $em = $this->kernel->getContainer()->get('doctrine')->getManager();
        $logEntities = $em->getRepository('DrafterbitSystemBundle:Log')
            ->createQueryBuilder('l')
            ->OrderBy('l.time', 'desc')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult();

        $logs = array_map(function($log){
            return [
                'time' => (new \DateTime())->setTimestamp($log->getTime()),
                'activity' => $this->kernel->getContainer()->get('drafterbit_system.log.display_formatter')->format($log->getMessage())
            ];
        }, $logEntities);

        return $this->renderView('DrafterbitSystemBundle:Panel:log.html.twig', [
            'logs' => $logs
        ]);
    }

    public function getName()
    {
        return 'log';
    }
}