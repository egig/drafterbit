<?php

namespace drafterbit\Bundle\UserBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use drafterbit\Bundle\UserBundle\Entity\Group;
use drafterbit\Bundle\UserBundle\Form\Type\GroupType;

class GroupController extends Controller
{
    /**
     * @Template()
     * @Security("is_granted('ROLE_GROUP_VIEW')")
     */
    public function indexAction(Request $request)
    {
        $viewId = 'group';
        $groupIds = $request->request->get('group', []);
        $action = $request->request->get('action');
        $token = $request->request->get('_token');

        if ($action == 'delete') {
            if (!$this->isCsrfTokenValid($viewId, $token)) {
                throw $this->createAccessDeniedException();
            }

            $groupManager = $this->get('fos_user.group_manager');

            foreach ($groupIds as $id) {
                $group = $groupManager->findGroupBy(['id' => $id]);

                try {
                    $groupManager->deleteGroup($group);
                } catch (\Exception $e) {

                    // instead of $e->getCode()
                    // https://github.com/doctrine/dbal/pull/221
                    if ($e->getPrevious()->getcode() == '23000') {
                        if ($this->get('kernel')->getEnvironment() == 'dev') {
                            $message = $e->getMessage();
                        } else {
                            $message = 'Can not delete group(s), some group might still have associated users';
                        }

                        return new JsonResponse([
                            'message' => $message,
                            'status' => 'error',
                        ]);
                    }
                }

                return new JsonResponse([
                    'message' => 'Group(s) Succesfully deleted',
                    'status' => 'success',
                ]);
            }
        }

        return [
            'view_id' => $viewId,
            'page_title' => $this->get('translator')->trans('Group'),
        ];
    }

    public function dataAction($status)
    {
        $groups = $this->container->get('fos_user.group_manager')->findGroups();

        $groupsArr = [];

        foreach ($groups as $group) {
            $data = [];
            $data[] = $group->getId();
            $data[] = $group->getName();
            $data[] = $group->getDescription();

            $groupsArr[] = $data;
        }

        $ob = new \StdClass();
        $ob->data = $groupsArr;
        $ob->recordsTotal = count($groupsArr);
        $ob->recordsFiltered = count($groupsArr);

        return new JsonResponse($ob);
    }

    /**
     * @Security("is_granted('ROLE_GROUP_EDIT')")
     * @Template("UserBundle:Group:edit.html.twig")
     */
    public function editAction($id)
    {
        $rolesGroup = $this->getRoles();

        $roles = [];
        foreach ($rolesGroup as $bundle => $attributes) {
            foreach ($attributes as $key => $value) {
                $roles[$key] = $value;
            }
        }

        $em = $this->getDoctrine()->getManager();
        $pageTitle = 'Edit Group';
        $group = $em->getRepository('UserBundle:Group')->find($id);

        if (!$group and ($id != 'new')) {
            throw  $this->createNotFoundException();
        }

        if (!$group) {
            $group = new Group(null);
            $pageTitle = 'New Group';
        }

        $form = $this->createForm(GroupType::class, $group);
        $form->get('id')->setData($id);

        return [
            'page_title' => $this->get('translator')->trans($pageTitle),
            'view_id' => 'group-edit',
            'action' => $this->generateUrl('dt_user_group_save'),
            'rolesGroup' => $rolesGroup,
            'form' => $form->createView(),
            'group_is_superadmin' => $group->hasRole('ROLE_SUPER_ADMIN'),
        ];
    }

    /**
     * @Method("POST")
     */
    public function saveAction(Request $request)
    {
        $rolesGroup = $this->getRoles();

        $roles = [];
        foreach ($rolesGroup as $bundle => $attributes) {
            foreach ($attributes as $key => $value) {
                $roles[$key] = $value;
            }
        }

        $requestGroup = $request->request->get('group');
        $id = $requestGroup['id'];

        $em = $this->getDoctrine()->getManager();

        if (!empty($id)) {
            $group = $em->getRepository('UserBundle:Group')->find($id);
        }

        if (empty($group)) {
            $group = new Group(null);
        }

        // creat form
        $form = $this->createForm(GroupType::class, $group);
        $form->handleRequest($request);

        if ($form->isValid()) {

            //save data to database
            $group = $form->getData();
            $em->persist($group);
            $em->flush();

            $id = $group->getId();

             // @todo
            $logger = $this->get('logger');
            $logger->info('%author% edited group %group%', ['author' => $this->getUser()->getId(), 'group' => $id]);

            $response = ['message' => 'Group saved', 'status' => 'success', 'id' => $id];
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

    private function getRoles()
    {
        $bundles = $this->get('kernel')->getBundles();
        $roles = [];
        foreach ($bundles as $name => $bundle) {
            if ($extension = $bundle->getContainerExtension()) {
                $parameter = $extension->getAlias().'.roles';
                $section = ucfirst(preg_replace('/^dt_/', '', $extension->getAlias()));
                if ($this->container->hasParameter($parameter)) {
                    $roles[$section] = $this->container->getParameter($parameter);
                }
            }
        }

        return $roles;
    }
}
