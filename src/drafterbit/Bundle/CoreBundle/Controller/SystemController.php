<?php

namespace drafterbit\Bundle\CoreBundle\Controller;

use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use drafterbit\Bundle\CoreBundle\Entity\Panel;

class SystemController extends Controller
{
    /**
     * @Route("/", name="dt_system_dashboard")
     * @Template()
     */
    public function dashboardAction()
    {
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('CoreBundle:Panel');

        $panelConfigs = $repo->findBy(['user' => $this->getUser()]);

        $panels = $this->buildPanels($panelConfigs);

        return [
            'left_panels' => $panels['left'],
            'right_panels' => $panels['right'],
            'page_title' => $this->get('translator')->trans('Dashboard'),
        ];
    }

    /**
     * Build panel data to be displayed;.
     *
     * @todo merge with DashboardController::buildPanels
     *
     * @return array
     */
    private function buildPanels($panelConfig)
    {
        $panels = ['left' => [], 'right' => []];

        foreach ($panelConfig as $config) {
            $panel = new \StdClass();
            $panel->id = $config->getId();
            $panel->sequence = $config->getSequence();
            $panel->status = $config->getStatus();
            $panel->context = json_decode($config->getContext());
            $panel->title = $config->getTitle() ? $config->getType() : $config->getTitle();
            $panel->name = $config->getType();
            $panelType = $this->get('dashboard')->getPanelType($config->getType());
            $panel->view = $panelType->getView($panel->context);

            $panels[$config->getPosition()][] = $panel;
        }

        $sortFunction = function ($a, $b) {
            if ($a->sequence == $b->sequence) {
                return 0;
            }

            return $b->sequence > $a->sequence ? -1 : 1;
        };

        usort($panels['left'], $sortFunction);
        usort($panels['right'], $sortFunction);

        return $panels;
    }

    /**
     * @Template()
     * @Security("is_granted('ROLE_LOG_VIEW')")
     */
    public function logAction(Request $request)
    {
        $viewId = 'log';
        $action = $request->request->get('action');
        $token = $request->request->get('_token');
        $data = [
            'view_id' => $viewId,
            'page_title' => $this->get('translator')->trans('Log'),
        ];

        if ($action) {
            if (!$this->isCsrfTokenValid($viewId, $token)) {
                throw $this->createAccessDeniedException();
            }

            $em = $this->getDoctrine()->getManager();
            $repo = $em->getRepository('CoreBundle:Log');

            switch ($action) {
                case 'delete':
                    $logIds = $request->request->get('log', []);
                    foreach ($logIds as $id) {
                        $log = $repo->find($id);
                        $em->remove($log);
                    }
                    $message = 'Logs deleted';
                    break;
                case 'clear':
                    $logs = $repo->findAll();
                     foreach ($logs as $log) {
                         $em->remove($log);
                     }
                    $message = 'All logs deleted';
                    break;
                default:
                    break;
            }

            $em->flush();
            $data['notif'] = ['message' => $this->get('translator')->trans($message), 'status' => 'success'];
        }

        return $data;
    }

    public function logDataAction()
    {
        $em = $this->getDoctrine()->getManager();
        $logs = $em->getRepository('CoreBundle:Log')->findAll();

        $logs = array_reverse($logs);
        $logArr = [];
        foreach ($logs as $log) {
            $data = [];
            $data[] = $log->getid();
            $data[] = date('d-m-Y H:i:s', $log->getTime());
            $data[] = $this->get('dt_system.log.display_formatter')->format($log->getMessage(), $log->getContext());

            $logArr[] = $data;
        }

        $ob = new \StdClass();
        $ob->data = $logArr;
        $ob->recordsTotal = count($logArr);
        $ob->recordsFiltered = count($logArr);

        return new jsonResponse($ob);
    }

    /**
     * @Template()
     * @Security("is_granted('ROLE_CACHE_VIEW')")
     */
    public function cacheAction(Request $request)
    {
        $notif = false;

        if ($message = $this->get('session')->getFlashBag()->get('message')) {
            $status = $this->get('session')->getFlashBag()->get('status');
            $notif = ['message' => $message[0], 'status' => $status[0]];
        }

        $cacheDir = $this->get('kernel')->getCacheDir();
        $finder = (new Finder())->in($cacheDir)->depth(0);

        $caches = [];

        foreach ($finder as $item) {
            $caches[] = [
                'key' => $item->getFilename(),
                'size' => (filesize($item->getRealPath()) / 1000).' kb',
            ];
        }

        return [
            'page_title' => $this->get('translator')->trans('Cache'),
            'notif' => $notif,
            'caches' => $caches,
        ];
    }

    /**
     * Cache clearer controller.
     */
    public function clearCacheAction(Request $request)
    {
        if ($this->get('kernel')->getEnvironment() == 'dev') {
            $message = $this->get('translator')
                ->trans('Cache can\'t be cleared from web interface in dev mode');
            $status = 'warning';
        } else {
            $cacheDir = $this->container->getParameter('kernel.cache_dir');
            $filesystem = $this->get('filesystem');
            $this->get('cache_clearer')->clear($cacheDir);
            $filesystem->remove($cacheDir);

            $message = $this->get('translator')->trans('Cache renewed');
            $status = 'success';
        }

        $this->addFlash('status',  $status);
        $this->addFlash('message', $message);
        // Don't user url generation, it will be failed due to cache dir just being cleared
        return new RedirectResponse($request->headers->get('REFERER'));
    }

    /**
     * @Template()
     */
    public function preferencesAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $panelConfigs = $panelConfig = $em->getRepository('CoreBundle:Panel')
            ->findBy(['user' => $this->getUser()]);

        $panels = $this->buildPanels($panelConfigs);

        return [
            'panels' => $this->get('dashboard')->getPanelTypes(),
            'left_panels' => $panels['left'],
            'right_panels' => $panels['right'],
            'page_title' => $this->get('translator')->trans('Preferences'),
        ];
    }
}
