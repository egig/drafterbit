<?php

namespace drafterbit\Bundle\CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use drafterbit\Bundle\CoreBundle\Entity\Panel;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class DashboardController extends Controller
{
    /**
     * @Template("CoreBundle:Panel:index.html.twig")
     */
    public function dataAction()
    {
        $em = $this->getDoctrine()->getManager();
        $panelConfigs = $em->getRepository('CoreBundle:Panel')
            ->findBy(['user' => $this->getUser()]);

        $panels = $this->buildPanels($panelConfigs);

        return [
            'left_panels' => $panels['left'],
            'right_panels' => $panels['right'],
        ];
    }

    /**
     * @Template("CoreBundle:Panel:edit.html.twig")
     */
    public function dashboardEditAction($id, Request $request)
    {
        $panelRequested = $request->request->get('panel');
        $id = $panelRequested['id'] ? $panelRequested['id'] : $id;

        // get panel from database
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('CoreBundle:Panel');
        $panel = $repo->find($id);

        if (!$panel) {
            // if panel not found by given id, we'll assume id is panel name
            $panelType = $this->get('dashboard')->getPanelType($id);

            if (!$panelType) {
                throw $this->createNotFoundException();
            }

            $panel = new Panel();
            $panel->setUser($this->getUser());
            $panel->setType($id);
            $panel->setPosition('left');
            $panel->setSequence(0);
            $panel->setStatus(1);
        } else {

            //get panel from dashboard manager
            $panelType = $this->get('dashboard')->getPanelType($panel->getType());
        }

        $title = empty($panel->getTitle()) ? $panelType->getName() : $panel->getTitle();

        $formBuilder = $this->get('form.factory')->createNamedBuilder('panel')
            ->add('id', HiddenType::class, ['data' => $id])
            ->add('title', TextType::class, ['data' => $title])
            ->add('position', ChoiceType::class, [
                'data' => $panel->getPosition(),
                'choices' => [
                    'Left' => 'left',
                    'Right' => 'right',
                ],
            ])
            ->add('Save', SubmitType::class);

        $panelData = json_decode($panel->getContext());
        $panelFormType = $panelType->getFormType();

        if ($panelFormType) {
            $formBuilder->add('context', $panelFormType, ['data' => $panelData]);
        }

        $form = $formBuilder->getForm();

        $form->handleRequest($request);

        if ($form->isValid()) {
            // @todo get data from the form
            $data = $request->request->get('panel');
            $context = isset($data['context']) ? $data['context'] : [];
            $panel->setContext(json_encode($context));
            $panel->setPosition($data['position']);
            $panel->setTitle($data['title']);
            $em->persist($panel);
            $em->flush();

            return new JsonResponse([
                'data' => [
                    'message' => $this->get('translator')->trans('Panel successfully saved.'),
                    'id' => $panel->getId(),
                ],
            ]);
        }

        return [
            'id' => $id,
            'template' => $panelType->getFormTemplate(),
            'form' => $form->createView(),
        ];
    }

    public function sortDashboardAction(Request $request)
    {
        $dashboardPanels = $this->get('dashboard')->getPanelTypes();
        $panels = array_keys($dashboardPanels);

        $order = $request->request->get('order');
        $pos = $request->request->get('pos');

        $order = explode(',', $order);

        $order = array_map(function ($el) {
            if ($part = substr($el, strlen('dashboard-panel-'))) {
                return $part;
            };
        }, $order);

        $em = $this->getDoctrine()->getManager();

        $i = 1;
        foreach ($order as $type) {
            if ($type) {
                $panelConfig = $em->getRepository('CoreBundle:Panel')
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

        // @todo return proper reponse
        return new Response();
    }

    public function dashboardDeleteAction(Request $request)
    {
        // @todo handle csrf token
        $id = $request->request->get('id');
        $em = $this->getDoctrine()->getManager();
        $panel = $em->getRepository('CoreBundle:Panel')->find($id);
        $em->remove($panel);
        $em->flush();

        return new JsonResponse(['data' => ['status' => 'ok']]);
    }

    public function togglePanelAction(Request $request)
    {
        $name = $request->request->get('panel');

        $em = $this->getDoctrine()->getManager();
        $panelConfig = $em->getRepository('CoreBundle:Panel')
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
     * Build panel data to be displayed;.
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
            $panel->title = is_null($config->getTitle()) ? $config->getType() : $config->getTitle();
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
}
