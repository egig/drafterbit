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
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

use Drafterbit\Bundle\SystemBundle\Entity\Panel;

/**
 * @Route("%admin%")
 */
class DashboardController extends Controller
{
    /**
     * @Route("/system/dashboard/data", name="dt_system_dashboard_data")
     * @Template("SystemBundle:Panel:index.html.twig")
     */
    public function dataAction()
    {
        $em = $this->getDoctrine()->getManager();
        $panelConfigs = $em->getRepository('SystemBundle:Panel')
            ->findBy(['user' => $this->getUser()]);;

        $panels = $this->buildPanels($panelConfigs);

        return [
            'left_panels' => $panels['left'],
            'right_panels' => $panels['right'],
        ];
    }

    /**
     * @Route("/system/dashboard/edit/{id}", name="dt_system_dashboard_edit")
     * @Template("SystemBundle:Panel:edit.html.twig")
     */
    public function dashboardEditAction($id, Request $request)
    {
        $panelRequested = $request->request->get('panel');
        $id = $panelRequested['id'] ? $panelRequested['id'] : $id;

        // get panel from database
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('SystemBundle:Panel');
        $panel = $repo->find($id);

        if(!$panel) {
            // if panel not found by given id, we'll assume id is panel name
            $panelType = $this->get('dashboard')->getPanelType($id);

            if(!$panelType) {
                throw $this->createNotFoundException();
            }

            $panel = new Panel;
            $panel->setUser($this->getUser());
            $panel->setType($id);
            $panel->setPosition('left');
            $panel->setSequence(0);
            $panel->setStatus(1);

        } else {

            //get panel from dashboard manager
            $panelType = $this->get('dashboard')->getPanelType($panel->getType());
        }


        $panelData = json_decode($panel->getContext());
        $title = empty($panelData->title) ? $panelType->getName() : $panelData->title;

        $form = $this->get('form.factory')->createNamedBuilder('panel')
            ->add('id', 'hidden', ['data' => $id])
            ->add('title', 'text', ['data' => $title])
            ->add('position', 'choice', [
                'data' => $panel->getPosition(),
                'choices' => [
                    'left' => 'Left',
                    'right' => 'Right'
                ]
            ])
            ->add('Save', 'submit')
            ->getForm();
            
        $panelForm = $panelType->getForm($panelData);
        if($panelForm) {
            //we need this since its not root form
            $panelForm->getConfig()->setAutoInitialize(false);    
            $form->add($panelForm);
        }

        $form->handleRequest($request);

        if($form->isValid())
        {
            // @todo get data from the form
            $data = $request->request->get('panel');
            $context = isset($data['context']) ? $data['context'] : []; 
            $context = array_merge($context, ['title' => $data['title']]);
            $panel->setContext(json_encode($context));
            $panel->setPosition($data['position']);
            $em->persist($panel);
            $em->flush();

            return new JsonResponse([
                'data' => [
                    'message' => $this->get('translator')->trans('Panel successfully saved.'),
                    'id' => $panel->getId(),
                ]
            ]);
        }

        return [
            'id' => $id,
            'template' => $panelType->getFormTemplate(),
            'form' => $form->createView()
        ];
    }

    /**
     * 
     * @Route("/system/dashboard/sort", name="dt_system_dashboard_sort")
     * @Method("POST")
     */
    public function sortDashboardAction(Request $request) {

        $dashboardPanels = $this->get('dashboard')->getPanelTypes();
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
        foreach ($order as $type) {

            if($type) {

                $panelConfig =  $em->getRepository('SystemBundle:Panel')
                    ->findOneBy(['user' => $this->getUser(), 'type' => $type]);

                $panelConfig or $panelConfig = new PanelConfig();

                $status = $panelConfig ? $panelConfig->getStatus() : 1;

                $panelConfig->setUser($this->getUser());
                $panelConfig->setType($type);
                $panelConfig->setPosition($pos);
                $panelConfig->setSequence($i++);

                $em->persist($panelConfig);
                $em->flush();
            }
        }

        return new Response();
    }

    /**
     * @Route("/system/dashboard/delete", name="dt_system_dashboard_delete")
     */
    public function dashboardDeleteAction(Request $request)
    {
        // @todo handle csrf token
        $id = $request->request->get('id');
        $em = $this->getDoctrine()->getManager();
        $panel = $em->getRepository('SystemBundle:Panel')->find($id);
        $em->remove($panel);
        $em->flush();

        return new JsonResponse(['data' => ['status' => 'ok']]);
    }

    /**
     * 
     * @Route("/system/dashboard/toggle_panel", name="dt_system_dashboard_toggle_panel")
     * @Method("POST")
     */
    public function togglePanelAction(Request $request) {

        $name = $request->request->get('panel');

        $em = $this->getDoctrine()->getManager();
        $panelConfig =  $em->getRepository('SystemBundle:Panel')
            ->findOneBy(['user' => $this->getUser(), 'name' => $name]);

        $panelConfig or $panelConfig = new PanelConfig();

        $status = $panelConfig->getStatus() ? 0 : 1;

        $panelConfig->setUser($this->getUser());
        $panelConfig->setStatus($status);
        $em->persist($panelConfig);
        $em->flush();

        return new Response();
    }


    /**
     * Build panel data to be displayed;
     *
     * @return array
     */
    private function buildPanels($panelConfig)
    {
        $panels = ['left' => [], 'right' => []];

        foreach ($panelConfig as $config) {

            $panel = new \StdClass;
            $panel->id = $config->getId();
            $panel->sequence = $config->getSequence();
            $panel->status = $config->getStatus();
            $panel->context = json_decode($config->getContext());
            $panel->title = $panel->context->title;
            $panel->name = $config->getType();
            $panelType = $this->get('dashboard')->getPanelType($config->getType());
            $panel->view = $panelType->getView($panel->context);

            $panels[$config->getPosition()][] = $panel;
        }

        $sortFunction = function($a, $b) {
            if($a->sequence == $b->sequence) {
                return 0;
            }
            return $b->sequence > $a->sequence ? -1 : 1;
        };

        usort($panels['left'], $sortFunction);
        usort($panels['right'], $sortFunction);

        return $panels;
    }
}