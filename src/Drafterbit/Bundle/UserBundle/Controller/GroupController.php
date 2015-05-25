<?php

namespace Drafterbit\Bundle\UserBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use Drafterbit\Bundle\UserBundle\Entity\Group;
use Drafterbit\Bundle\UserBundle\Form\Type\GroupType;

/**
 * @Route("%admin%")
 */
class GroupController extends Controller
{
	/**
     * @Route("/user/group", name="drafterbit_user_group")
     * @Template()
     */
    public function indexAction()
    {
    	return [
            'view_id' => 'group',
            'page_title' => $this->get('translator')->trans('Group')
        ];
    }

    /**
     * @Route("/user/group/data/{status}", name="drafterbit_user_group_data")
     */
    public function dataAction($status)
    {
        //$users = $this->get('fos_user.user_manager')->findUsers();
    	$groups = $this->container->get('fos_user.group_manager')->findGroups();

        $groupsArr  = [];

        foreach ($groups as $group) {
            $data = [];
            $data[] = $group->getId();
            $data[] = $group->getName();
            $data[] = $group->getDescription();

            $groupsArr[] = $data;
        }

        $ob = new \StdClass;
        $ob->data = $groupsArr;
        $ob->recordsTotal= count($groupsArr);
        $ob->recordsFiltered = count($groupsArr);

        return new JsonResponse($ob);
    }

    /**
     * @Route("/user/group/edit/{id}", name="drafterbit_user_group_edit")
     * @Template()
     */
    public function editAction($id = 0)
    {
        $rolesGroup = $this->getRoles();

        $roles = [];
        foreach($rolesGroup as $bundle => $attributes) {
            foreach ($attributes as $key => $value) {
                $roles[$key] = $value;
            }
        }

        $em = $this->getDoctrine()->getManager();
        $pageTitle = 'Edit Group';
        $group = $em->getRepository('DrafterbitUserBundle:Group')->find($id);
        if(!$group) {
            $group = new Group(null);
            $pageTitle = 'New Group';
        }

        $form = $this->createForm(new GroupType($roles), $group);
        $form->get('id')->setData($id);

        return [
            'page_title' => $this->get('translator')->trans($pageTitle),
            'view_id' => 'group-edit',
            'action' => $this->generateUrl('drafterbit_user_group_save'),
            'rolesGroup' => $rolesGroup,
            'form' => $form->createView()
        ];
    }

    /**
     * @Route("/user/group/save", name="drafterbit_user_group_save")
     * @Method("POST")
     */
    public function saveAction(Request $request)
    {
        $rolesGroup = $this->getRoles();

        $roles = [];
        foreach($rolesGroup as $bundle => $attributes) {
            foreach ($attributes as $key => $value) {
                $roles[$key] = $value;
            }
        }

        $requestGroup = $request->request->get('group');
        $id = $requestGroup['id'];

        $em = $this->getDoctrine()->getManager();

        if(!empty($id)) {
            $group = $em->getRepository('DrafterbitUserBundle:Group')->find($id);
        }

        if(empty($group)) {
            $group = new Group(null);
        }

        // creat form
        $form = $this->createForm(new GroupType($roles), $group);
        $form->handleRequest($request);

        if($form->isValid()) {

            //save data to database
            $group = $form->getData();
            $em->persist($group);
            $em->flush();

            $id = $group->getId();

            $response = ['message' => 'Group saved', 'status' => 'success', 'id' => $id];
        } else {

            $errors = [];
            $formView = $form->createView();

            foreach ($formView as $inputName => $view) {
                if(isset($view->vars['errors'])) {                
                    foreach($view->vars['errors'] as $error) {
                        $errors[$view->vars['full_name']] = $error->getMessage();
                    }
                }
            }

            $response['error'] = [
                'type' => 'validation',
                'messages' => $errors
            ];
        }

        return new JsonResponse($response);
    }

    private function getRoles()
    {
        $bundles = $this->get('kernel')->getBundles();
        $roles = [];
        foreach ($bundles as $name => $bundle) {

            if($extension = $bundle->getContainerExtension()) {

                $parameter = $extension->getAlias().'.roles';
                $section = ucfirst(preg_replace('/^drafterbit_/', '', $extension->getAlias()));
                if($this->container->hasParameter($parameter)){
                    $roles[$section] = $this->container->getParameter($parameter);
                }
            }
        }

        return $roles;
    }
}