<?php

namespace Drafterbit\Bundle\UserBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

use Drafterbit\Bundle\UserBundle\Form\Type\UserType;
use Drafterbit\Bundle\UserBundle\Entity\User;

/**
 * @Route("%admin%")
 */
class UserController extends Controller
{
    /**
     * @Route("/user", name="drafterbit_user")
     * @Template()
     * @Security("is_granted('ROLE_USER_VIEW')")
     */
    public function indexAction(Request $request)
    {
        $userIds = $request->request->get('users', []);
        $action = $request->request->get('action');

        if($action == 'delete') {
            $userManager = $this->get('fos_user.user_manager');

            foreach ($userIds as $id) {
                $user = $userManager->findUserBy(['id' => $id]);
                
                try {                
                    $userManager->deleteUser($user);
                } catch (\Exception $e) {

                    // instead of $e->getCode()
                    // https://github.com/doctrine/dbal/pull/221
                    if($e->getPrevious()->getcode() == '23000') {

                        if($this->get('kernel')->getEnvironment() == 'dev') {
                            $message = $e->getMessage();
                        } else {
                            $message = "Can not delete user(s), some users might still have associated object (post, page, etc)";
                        }

                        return new JsonResponse([
                            'message' => $message,
                            'status' => 'error'
                        ]);
                    }
                }
            }

            return new JsonResponse([
                'message' => 'User(s) Succesfully deleted',
                'status' => 'success'
            ]);
        }

    	return [
            'view_id' => 'user',
            'page_title' => $this->get('translator')->trans('User')
        ];
    }

    /**
     * @Route("/user/data/{status}", name="drafterbit_user_data")
     */
    public function dataAction($status)
    {
        $users = $this->get('fos_user.user_manager')->findUsers();

        $usersArr  = [];

        foreach ($users as $user) {
            $data = [];
            $data[] = $user->getId();
            $data[] = $user->getUsername();
            $data[] = $user->getEmail();
            $data[] = (string) $user->isEnabled();

            $usersArr[] = $data;
        }

        $ob = new \StdClass;
        $ob->data = $usersArr;
        $ob->recordsTotal= count($usersArr);
        $ob->recordsFiltered = count($usersArr);

        return new JsonResponse($ob);
    }

    /**
     * @Route("/user/edit/{id}", name="drafterbit_user_edit")
     * @Template()
     * @Security("is_granted('ROLE_USER_EDIT')")
     */
    public function editAction($id)
    {
        $userManager = $this->get('fos_user.user_manager');

        $pageTitle = 'Edit User';
        $user = $userManager->findUserBy(['id' => $id]);
        if(!$user) {
            $user = new User(); 
            $pageTitle = 'New User';
        }

        $form = $this->createForm(new UserType, $user);
        $form->get('id')->setData($id);

        return [
            'page_title' => $this->get('translator')->trans($pageTitle),
            'view_id' => 'user-edit',
            'action' => $this->generateUrl('drafterbit_user_save'),
            'form' => $form->createView()
        ];
    }

    /**
     * @Route("/user/save", name="drafterbit_user_save")
     * @Template()
     */
    public function saveAction(Request $request)
    {
        $requestUser = $request->request->get('user');
        $id = $requestUser['id'];

        $userManager = $this->get('fos_user.user_manager');
        $user = $userManager->findUserBy(['id' => $id]);
        if(!$user) {
            $user = new User();
            $user->addRole('ROlE_ADMIN');
        }

        $form = $this->createForm(new UserType, $user);
        $form->handleRequest($request);

         if($form->isValid()) {

            //save data to database
            $user = $form->getData();

            $password = $form->get('password')->getData();
            if(trim($password) != '') {
                $user->setPlainPassword($password);
            }

            $userManager->updateUser($user);

            $id = $user->getId();

            // @todo
            $logger = $this->get('logger');
            $logger->info(':user:'.$this->getUser()->getId().' edited :user:'.$id, ['id' => $id]);

            $response = ['message' => 'User saved', 'status' => 'success', 'id' => $id];
        } else {

            $errors = [];
            $formView = $form->createView();

            // @todo clean this, make a recursive
            foreach ($formView as $inputName => $view) {

                if($view->children) {
                    foreach ($view->children as $name => $childView) {
                        if(isset($childView->vars['errors'])) {
                            foreach($childView->vars['errors'] as $error) {
                                $errors[$childView->vars['full_name']] = $error->getMessage();
                            }
                        }
                    }
                }

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
}