<?php

namespace Drafterbit\Bundle\SystemBundle\Dashboard;

class LogPanel extends Panel {

	public function getView()
	{
		$em = $this->kernel->getContainer()->get('doctrine')->getManager();
        $logEntities = $em->getRepository('DrafterbitSystemBundle:Log')
        	->createQueryBuilder('l')
        	->setMaxResults(10)
        	->getQuery()
        	->getResult();

        $logs = array_map(function($log){
			return [
				'time' => (new \DateTime())->setTimestamp($log->getTime()),
				'activity' => $this->kernel->getContainer()->get('system_log_display_formatter')->format($log->getMessage())
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