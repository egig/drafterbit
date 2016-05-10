<?php

namespace drafterbit\Bundle\CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use drafterbit\Bundle\CoreBundle\Entity\Widget;
use drafterbit\Bundle\CoreBundle\Form\Type\WidgetType;

class WidgetController extends Controller
{
    public function deleteAction(Request $request)
    {
        $id = $request->request->get('id');
        $em = $this->getDoctrine()->getManager();
        $widget = $em->getRepository('CoreBundle:Widget')
            ->find($id);
        $em->remove($widget);
        $em->flush();

        return new Response();
    }

    public function saveAction(Request $request)
    {
        $position = $request->request->get('position');
        $widgetRequested = $request->request->get('widget');

        $id = $widgetRequested['id'];

        $em = $this->getDoctrine()->getManager();
        $widget = $em->getRepository('CoreBundle:Widget')
            ->find($id);

        if (!$widget) {
            $sequence = 0;
            $widget = new Widget();
        } else {
            $sequence = $widget->getSequence();
        }

        $form = $this->createForm(new WidgetType(), $widget);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $widget = $form->getData();
            $widget->setPosition($position);
            $widget->setSequence($sequence);

            $context = json_encode($widgetRequested);

            $widget->setContext($context);

            $em->persist($widget);
            $em->flush();

            return new JsonResponse(['message' => 'Widget saved', 'status' => 'success', 'id' => $widget->getId()]);
        } else {
            return new Response($form->getErrorsAsString());
        }

        // @todo return error
    }

    public function sortAction(Request $request)
    {
        $ids = $request->request->get('order');
        $em = $this->getDoctrine()->getManager();

        $order = 1;
        foreach (array_filter(explode(',', $ids)) as $temp) {
            $temp2 = explode('-', $temp);
            $id = current($temp2);
            //$data = ['sequence' => $order];

            $widget = $em->getRepository('CoreBundle:Widget')->find($id);

            $widget->setSequence($order);
            $em->persist($widget);
            $em->flush();

            ++$order;
        }

        return new Response(1);
    }
}
