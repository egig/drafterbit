<?php

namespace drafterbit\Bundle\CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use drafterbit\Bundle\CoreBundle\Form\Type\MenuType;
use drafterbit\Bundle\CoreBundle\Entity\Menu;
use drafterbit\Bundle\CoreBundle\Entity\MenuItem;

class MenuController extends Controller
{
    /**
     * @Template("CoreBundle::menu.html.twig")
     * @Security("is_granted('ROLE_MENU_MANAGE')")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();
        $menus = $em->getRepository('CoreBundle:Menu')->findAll();

        foreach ($menus as &$menu) {
            $items = $em->getRepository('CoreBundle:MenuItem')->findby(['menu' => $menu]);
            $menu->items = $this->buildFamily($items);
        }

        $form = $this->createForm(MenuType::class);

        $pages = $em->getRepository('PageBundle:Page')->findAll();

        return [
            'form' => $form->createView(),
            'menus' => $menus,
            'page_title' => $this->get('translator')->trans('Menus'),
        ];
    }

    private function buildFamily($items, $parent = null)
    {
        $array = [];
        foreach ($items as $item) {
            if ($item->getParent() == $parent) {
                $item->childs = $this->buildFamily($items, $item);

                $array[] = $item;
            }
        }

        return $array;
    }

    public function saveAction(Request $request)
    {
        $form = $this->createForm(MenuType::class, new Menu());
        $form->handleRequest($request);

        if ($form->isValid()) {

            //save data to database
            $menu = $form->getData();
            $em = $this->getDoctrine()->getManager();
            $em->persist($menu);
            $em->flush();

            $id = $menu->getId();

            // @todo
            // $logger = $this->get('logger');
            // $logger->info(':user:'.$this->getUser()->getId().' edited :user:'.$id, ['id' => $id]);

            $response = [
                'slug' => $menu->getDisplayText(),
                'id' => $id,
            ];
        } else {
            $errors = [];
            foreach ($form->getErrors(true) as $error) {
                $name = $error->getOrigin()->createView()->vars['full_name'];
                $errors[$name] = $error->getMessage();
            }

            $response['error'] = [
                'type' => 'validation',
                'messages' => $errors,
            ];
        }

        return new JsonResponse($response);
    }

    /**
     * Actually this is also saving menu if the name changes.
     */
    public function sortAction(Request $request)
    {
        $items = $request->request->get('menus');
        $name = $request->request->get('name');
        $id = $request->request->get('id');

        $em = $this->getDoctrine()->getManager();
        $menu = $em->getRepository('CoreBundle:Menu')->find($id);
        $menu->setDisplayText($name);
        $em->persist($menu);
        $em->flush();

        $menuItemRepo = $em->getRepository('CoreBundle:MenuItem');
        if ($items) {
            foreach ($items as $data) {
                $parent = $menuItemRepo->find($data['parent']);

                $item = $menuItemRepo->find($data['id']);
                $item->setSequence($data['sequence']);
                $item->setParent($parent);

                $em->persist($item);
                $em->flush();
            }
        }

        return new JsonResponse(['message' => 'Menus '.$name.' saved', 'status' => 'success']);
    }

    public function deleteAction(Request $request)
    {
        $id = $request->request->get('id');
        $em = $this->getDoctrine()->getManager();
        $menu = $em->getRepository('CoreBundle:Menu')->find($id);

        $items = $em->getRepository('CoreBundle:MenuItem')
            ->findBy(['menu' => $menu]);

        foreach ($items as $item) {
            $em->remove($item);
        }

        $em->remove($menu);
        $em->flush();

        return new Response();
    }

    public function itemAddAction(Request $request)
    {
        $id = $request->request->get('menu_id');
        $em = $this->getDoctrine()->getManager();
        $menu = $em->getRepository('CoreBundle:Menu')->find($id);

        $item = new MenuItem();
        $item->setDisplayText('New Menu Item');
        $item->setLink('#');
        $item->setMenu($menu);
        $item->setSequence(0);
        $em->persist($item);
        $em->flush();

        return new JsonResponse([
            'label' => $item->getDisplayText(),
            'menu_id' => $item->getMenu()->getId(),
            'parent_id' => 0,
            'link' => '#',
            'id' => $item->getId(),
        ]);
    }

    public function itemDeleteAction(Request $request)
    {
        $id = $request->request->get('id');
        $em = $this->getDoctrine()->getManager();
        $item = $em->getRepository('CoreBundle:MenuItem')->find($id);

        $childs = $em->getRepository('CoreBundle:MenuItem')
            ->findBy(['parent' => $item]);

        foreach ($childs as $child) {
            $em->remove($child);
        }

        $em->remove($item);
        $em->flush();

        return new Response();
    }

    public function itemSaveAction(Request $request)
    {
        $id = $request->request->get('id');
        $displayText = $request->request->get('displayText');
        $link = $request->request->get('link');

        $id = $request->request->get('id');
        $em = $this->getDoctrine()->getManager();
        $item = $em->getRepository('CoreBundle:MenuItem')->find($id);
        $item->setDisplayText($displayText);
        $item->setLink($link);

        $errors = $this->get('validator')->validate($item);

        if ((boolean) count($errors)) {
            $messages = [];

            foreach ($errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }

            $response = [
                'error' => [
                    'type' => 'validation',
                    'messages' => $messages,
                ],
            ];
        } else {
            $em->persist($item);
            $em->flush();

            $response = [
                'message' => 'Menu item saved',
                'id' => $id,
            ];
        }

        return new JsonResponse($response);
    }
}
