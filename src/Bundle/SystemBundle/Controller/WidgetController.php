<?php

namespace Drafterbit\Bundle\SystemBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

use Drafterbit\Bundle\SystemBundle\Entity\Widget;
use Drafterbit\Bundle\SystemBundle\Form\Type\WidgetType;

/**
 * @Route("%admin%")
 */
class WidgetController extends Controller
{
	/**
     * @Route("/setting/widget/delete", name="dt_setting_widget_delete")
     */
    public function deleteAction(Request $request)
    {
        $id = $request->request->get('id');
        $em = $this->getDoctrine()->getManager();
        $widget = $em->getRepository('SystemBundle:Widget')
            ->find($id);
        $em->remove($widget);
        $em->flush();

        return new Response();
    }

    /**
     * @Route("/setting/widget/save", name="dt_setting_widget_save")
     */
    public function saveAction(Request $request)
    {
        $position = $request->request->get('position');
        $widgetRequested = $request->request->get('widget');

        $id = $widgetRequested['id'];

        $em = $this->getDoctrine()->getManager();
        $widget = $em->getRepository('SystemBundle:Widget')
            ->find($id);

        if(!$widget) {
            $sequence = 0;
            $widget = new Widget;
        } else {
            $sequence = $widget->getSequence();
        }

        $form = $this->createForm(new WidgetType, $widget);
        $form->handleRequest($request);

        if($form->isValid()) {
            $widget = $form->getData();
            $widget->setPosition($position);
            $widget->setSequence($sequence);

            $context = json_encode($widgetRequested);

            $widget->setContext($context);

            $em->persist($widget);
            $em->flush();

            return new JsonResponse(['message' => 'Widget saved', 'status' => 'success', 'id' =>  $widget->getId()]);
        } else {
            return new Response($form->getErrorsAsString());
        }

        // @todo return error
    }

    /**
     * @Route("/setting/widget/sort", name="dt_setting_widget_sort")
     */
    public function sortAction(Request $request)
    {
        $ids = $request->request->get('order');
        $em = $this->getDoctrine()->getManager();

        $order = 1;
        foreach (array_filter(explode(',', $ids)) as $temp) {
            $temp2 = explode('-', $temp);
            $id = current($temp2);
            //$data = ['sequence' => $order];

            $widget = $em->getRepository('SystemBundle:Widget')->find($id);

            $widget->setSequence($order);
            $em->persist($widget);
            $em->flush();

            $order++;
        }

        return new Response(1);
    }

}