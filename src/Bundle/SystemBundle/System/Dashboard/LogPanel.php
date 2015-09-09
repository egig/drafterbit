<?php

namespace Drafterbit\Bundle\SystemBundle\System\Dashboard;

use Drafterbit\System\Dashboard\Panel;
use Drafterbit\Bundle\SystemBundle\Form\Type\Panel\LogType;

class LogPanel extends Panel {

    const LOG_NUM = 10;

    public function getView()
    {
        $maxResult = ($this->context) ? $this->context->num : static::LOG_NUM;
        $em = $this->container->get('doctrine')->getManager();
        $logEntities = $em->getRepository('SystemBundle:Log')
            ->createQueryBuilder('l')
            ->OrderBy('l.time', 'desc')
            ->setMaxResults($maxResult)
            ->getQuery()
            ->getResult();

        $logs = array_map(function($log){
            return [
                'time' => (new \DateTime())->setTimestamp($log->getTime()),
                'activity' => $this->container
                    ->get('dt_system.log.display_formatter')->format($log->getMessage(), $log->getContext())
            ];
        }, $logEntities);

        return $this->renderView('SystemBundle:Panel:log.html.twig', [
            'logs' => $logs
        ]);
    }

    public function getForm($data = null)
    {
        return $this->container->get('form.factory')->create(new LogType(), $data);
    }

    public function getFormTemplate()
    {
        return "SystemBundle:Panel:edit/log.html.twig";
    }

    public function getName()
    {
        return 'log';
    }
}
