<?php

namespace drafterbit\Bundle\CoreBundle\System\Dashboard\PanelType;

use drafterbit\Core\Dashboard\PanelType;
use drafterbit\Bundle\CoreBundle\Form\Type\Panel\LogType;

class Log extends PanelType
{
    const LOG_NUM = 10;

    public function getView($context = null)
    {
        $maxResult = isset($context->num) ? $context->num : static::LOG_NUM;
        $em = $this->container->get('doctrine')->getManager();
        $logEntities = $em->getRepository('CoreBundle:Log')
            ->createQueryBuilder('l')
            ->OrderBy('l.time', 'desc')
            ->setMaxResults($maxResult)
            ->getQuery()
            ->getResult();

        $logs = array_map(function ($log) {
            return [
                'time' => (new \DateTime())->setTimestamp($log->getTime()),
                'activity' => $this->container
                    ->get('dt_system.log.display_formatter')->format($log->getMessage(), $log->getContext()),
            ];
        }, $logEntities);

        return $this->renderView('CoreBundle:Panel:log.html.twig', [
            'logs' => $logs,
        ]);
    }

    public function getFormType()
    {
        return LogType::class;
    }

    public function getFormTemplate()
    {
        return 'CoreBundle:Panel:edit/log.html.twig';
    }

    public function getName()
    {
        return 'Log';
    }
}
