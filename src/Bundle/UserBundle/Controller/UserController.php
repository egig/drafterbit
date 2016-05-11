<?php

namespace drafterbit\Bundle\UserBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use drafterbit\Bundle\UserBundle\Form\Type\UserType;
use drafterbit\Bundle\UserBundle\Form\Type\ProfileType;
use drafterbit\Bundle\UserBundle\Entity\User;

class UserController extends Controller
{
    /**
     * @Template()
     * @Security("is_granted('ROLE_USER_VIEW')")
     */
    public function indexAction(Request $request)
    {
        $viewId = 'user';
        $userIds = $request->request->get('users', []);
        $action = $request->request->get('action');
        $token = $request->request->get('_token');

        if ($action == 'delete') {
            if (!$this->isCsrfTokenValid($viewId, $token)) {
                throw $this->createAccessDeniedException();
            }
            $userManager = $this->get('fos_user.user_manager');

            foreach ($userIds as $id) {
                $user = $userManager->findUserBy(['id' => $id]);

                try {
                    $userManager->deleteUser($user);
                } catch (\Exception $e) {

                    // instead of $e->getCode()
                    // https://github.com/doctrine/dbal/pull/221
                    if ($e->getPrevious()->getcode() == '23000') {
                        if ($this->get('kernel')->getEnvironment() == 'dev') {
                            $message = $e->getMessage();
                        } else {
                            $message = 'Can not delete user(s), some users might still have associated object (post, page, etc)';
                        }

                        return new JsonResponse([
                            'message' => $message,
                            'status' => 'error',
                        ]);
                    }
                }
            }

            return new JsonResponse([
                'message' => 'User(s) Succesfully deleted',
                'status' => 'success',
            ]);
        }

        $groups = $this->getDoctrine()->getManager()
            ->getRepository('UserBundle:Group')->findAll();

        return [
            'view_id' => $viewId,
            'groups' => $groups,
            'page_title' => $this->get('translator')->trans('User'),
        ];
    }

    /**
     * @Route("/user/data", name="dt_user_data")
     */
    public function dataAction(Request $request)
    {
        $status = $request->query->get('status');
        $group = $request->query->get('group');

        $queryBuilder = $this->getDoctrine()
            ->getRepository('UserBundle:User')
            ->createQueryBuilder('u');

        if ($group) {
            $queryBuilder->join('u.groups', 'g', 'WITH', 'g.id = :groupId ')
                ->setParameter('groupId', $group);
        }

        if ('all' !== $status) {
            $isEnabled = $status == 'enabled' ? 1 : 0;
            $queryBuilder->where('u.enabled = :enabled')->setParameter('enabled', $isEnabled);
        }

        $users = $queryBuilder->getQuery()->getResult();

        $usersArr = [];

        foreach ($users as $user) {
            $data = [];
            $data[] = $user->getId();
            $data[] = $user->getUsername();
            $data[] = $user->getEmail();
            $data[] = (string) $user->isEnabled();

            $usersArr[] = $data;
        }

        $ob = new \StdClass();
        $ob->data = $usersArr;
        $ob->recordsTotal = count($usersArr);
        $ob->recordsFiltered = count($usersArr);

        return new JsonResponse($ob);
    }

    /**
     * @Template()
     * @Security("is_granted('ROLE_USER_EDIT')")
     */
    public function editAction($id)
    {
        $userManager = $this->get('fos_user.user_manager');

        $pageTitle = 'Edit User';
        $user = $userManager->findUserBy(['id' => $id]);

        if (!$user and ($id != 'new')) {
            throw  $this->createNotFoundException();
        }

        if (!$user) {
            $user = new User();
            $pageTitle = 'New User';
        }

        $form = $this->createForm(UserType::class, $user);
        $form->get('id')->setData($id);

        return [
            'page_title' => $this->get('translator')->trans($pageTitle),
            'view_id' => 'user-edit',
            'action' => $this->generateUrl('dt_user_save'),
            'form' => $form->createView(),
        ];
    }

    /**
     * @Template()
     */
    public function saveAction(Request $request)
    {
        if ($requestUser = $request->request->get('profile')) {
            $formClass = ProfileType::class;
        } elseif ($requestUser = $request->request->get('user')) {
            $formClass = UserType::class;
        }

        $id = $requestUser['id'];

        $userManager = $this->get('fos_user.user_manager');
        $user = $userManager->findUserBy(['id' => $id]);
        if (!$user) {
            $user = new User();
            $user->addRole('ROlE_ADMIN');
        }

        $form = $this->createForm($formClass, $user);
        $form->handleRequest($request);

        if ($form->isValid()) {

            //save data to database
            $user = $form->getData();

            $password = $form->get('password')->getData();
            if (trim($password) != '') {
                $user->setPlainPassword($password);
            }

            $userManager->updateUser($user);

            $id = $user->getId();

            // @todo
            $logger = $this->get('logger');
            $logger->info('%author% edited user %user%', ['author' => $this->getUser()->getId(), 'user' => $id]);

            $response = ['message' => 'User saved', 'status' => 'success', 'id' => $id];
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
     * @Route("/user/profile", name="dt_user_profile")
     * @Template("UserBundle:User:profile.html.twig")
     */
    public function profileAction(Request $request)
    {
        $pageTitle = 'Profile';
        $user = $this->getUser();

        $form = $this->createForm(ProfileType::class, $user);
        $form->get('id')->setData($user->getId());

        return [
            'page_title' => $this->get('translator')->trans($pageTitle),
            'view_id' => 'user-edit',
            'action' => $this->generateUrl('dt_user_save'),
            'form' => $form->createView(),
        ];
    }
}
