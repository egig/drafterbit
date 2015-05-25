<?php

namespace Drafterbit\Bundle\SystemBundle\Controller;

use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use Drafterbit\Bundle\SystemBundle\Entity\PanelConfig;

/**
 * @Route("%admin%")
 */
class SystemController extends Controller
{
    /**
     * @Route("/", name="drafterbit_system_dashboard")
     * @Template()
     */
    public function dashboardAction()
    {
        $em = $this->getDoctrine()->getManager();

        $i=1;
        foreach ($this->get('dashboard')->getPanels() as $name => $panel) {
            $panelConfig = $em->getRepository('DrafterbitSystemBundle:PanelConfig')
            ->findOneBy(['user' => $this->getUser(), 'name' => $name]);

            if(!$panelConfig) {
                $panelConfig = new PanelConfig();

                $status = $panelConfig ? $panelConfig->getStatus() : 1;

                $panelConfig->setUser($this->getUser());
                $panelConfig->setName($name);
                $panelConfig->setPosition('left');
                $panelConfig->setSequence($i++);
                $panelConfig->setStatus(1);

                $em->persist($panelConfig);
                $em->flush();
            }

            $panelConfigs[] = $panelConfig;
        }

        $panels = $this->buildPanels($panelConfigs);

        return [
            'panels' => $this->get('dashboard')->getPanels(),
            'left_panels' => $panels['left'],
            'right_panels' => $panels['right'],
            'page_title' => $this->get('translator')->trans('Dashboard')
        ];
    }

    private function buildPanels($panelConfig)
    {
        $panels = [];
        $panels['left'] = [];
        $panels['right'] = [];

        foreach ($panelConfig as $config) {
            $panel = $this->get('dashboard')->getPanel($config->getName());
            $panel->status = $config->getStatus();
            $panels[$config->getPosition()][] = $panel;
        }

        return $panels;
    }

    /**
     * @Route("/system/log", name="drafterbit_system_log")
     * @Template()
     */
    public function logAction()
    {
    	return [
            'view_id' => 'log',
            'page_title' => $this->get('translator')->trans('Log')
        ];
    }

    /**
     * @Route("/system/log/data", name="drafterbit_system_log_data")
     * @Template()
     */
    public function logDataAction()
    {
        $em = $this->getDoctrine()->getManager();
        $logs = $em->getRepository('DrafterbitSystemBundle:Log')->findAll();

        $logArr = [];
        foreach ($logs as $log) {
            
            $data = [];
            $data[] = $log->getid();
            $data[] = date('d-m-Y H:i:s', $log->getTime());
            $data[] = $this->get('system_log_display_formatter')->format($log->getMessage());

            $logArr[] = $data;
        }

        $ob = new \StdClass;
        $ob->data = $logArr;
        $ob->recordsTotal= count($logArr);
        $ob->recordsFiltered = count($logArr);

        return new jsonResponse($ob);
    }

    /**
     * @Route("/system/cache", name="drafterbit_system_cache")
     * @Template()
     */
    public function cacheAction()
    {
        $cacheDir = $this->get('kernel')->getCacheDir();
        $finder = (new Finder)->in($cacheDir)->depth(0);

        $caches = [];

        foreach ($finder as $item) {
            $caches[] = [
                'key' => $item->getFilename(),
                'size' => (filesize($item->getRealPath())/1000).' kb',
            ];
        }

        return ['page_title' => $this->get('translator')->trans('Cache'), 'caches' => $caches];
    }

    /**
     * @Route("/system/cache/clear", name="drafterbit_system_cache_clear")
     * @todo do this use php, not exec
     */
    public function clearCacheAction()
    {
        $kernel = $this->get('kernel');
        exec('php '.$kernel->getRootDir().'/console cache:clear --env="'.$kernel->getEnvironment().'"');

        return new RedirectResponse($this->generateUrl('drafterbit_system_cache'));
    }

    /**
     * 
     * @Route("/system/dashboard/sort", name="drafterbit_system_dashboard_sort")
     * @Method("POST")
     */
    public function sortDashboardAction(Request $request) {

        $dashboardPanels = $this->get('dashboard')->getPanels();
        $panels = array_keys($dashboardPanels);

        $order = $request->request->get('order');
        $pos = $request->request->get('pos');

        $order = explode(',', $order);

        $order = array_map(function($el){
            if($part = substr($el, strlen('dashboard-panel-'))) {
                return $part;
            };
        }, $order);

        $em = $this->getDoctrine()->getManager();

        $i = 1;
        foreach ($order as $name) {

            if($name) {

                $panelConfig =  $em->getRepository('DrafterbitSystemBundle:PanelConfig')
                ->findOneBy(['user' => $this->getUser(), 'name' => $name]);

                $panelConfig or $panelConfig = new PanelConfig();

                $status = $panelConfig ? $panelConfig->getStatus() : 1;

                $panelConfig->setUser($this->getUser());
                $panelConfig->setName($name);
                $panelConfig->setPosition($pos);
                $panelConfig->setSequence($i++);

                $em->persist($panelConfig);
                $em->flush();
            }
        }

        return new Response();
    }


    /**
     * 
     * @Route("/system/dashboard/toggle_panel", name="drafterbit_system_dashboard_toggle_panel")
     * @Method("POST")
     */
    public function togglePanelAction(Request $request) {

        $name = $request->request->get('panel');

        $em = $this->getDoctrine()->getManager();
        $panelConfig =  $em->getRepository('DrafterbitSystemBundle:PanelConfig')
            ->findOneBy(['user' => $this->getUser(), 'name' => $name]);

        $panelConfig or $panelConfig = new PanelConfig();

        $status = $panelConfig->getStatus() ? 0 : 1;

        $panelConfig->setUser($this->getUser());
        $panelConfig->setStatus($status);
        $em->persist($panelConfig);
        $em->flush();

        return new Response();
    }
}