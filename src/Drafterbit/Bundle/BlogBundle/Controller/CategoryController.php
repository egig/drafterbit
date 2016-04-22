<?php

namespace Drafterbit\Bundle\BlogBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Drafterbit\Bundle\BlogBundle\Form\Type\CategoryType;
use Drafterbit\Bundle\BlogBundle\Entity\Category;

class CategoryController extends Controller
{
    /**
     * @Template()
     * @Security("is_granted('ROLE_CATEGORY_VIEW')")
     */
    public function indexAction(Request $request)
    {
        $viewId = 'category';

        if ($action = $request->request->get('action')) {

            // safety first
            $token = $request->request->get('_token');
            if (!$this->isCsrfTokenValid($viewId, $token)) {
                throw $this->createAccessDeniedException();
            }

            $categories = $request->request->get('categories');

            if (!$categories) {
                return new JsonResponse([
                    'status' => 'error',
                    'message' => $this->get('translator')->trans('Please make selection first'),
                ]);
            }

            $em = $this->getDoctrine()->getManager();

            foreach ($categories as $id) {
                $category = $em->getRepository('BlogBundle:Category')->find($id);

                switch ($action) {
                    case 'delete':

                        $em->remove($category);

                        $status = 'success';
                        $message = 'Categories deleted permanently';
                        break;
                    default:
                        break;
                }

                $em->flush();
            }

            return new JsonResponse([
                'status' => $status,
                'message' => $this->get('translator')->trans($message),
            ]);
        }

        return [
            'view_id' => 'category',
            'page_title' => $this->get('translator')->trans('Category'),
        ];
    }

    /**
     * @Template()
     * @Security("is_granted('ROLE_CATEGORY_EDIT')")
     */
    public function editAction($id, Request $request)
    {
        $category = $this
            ->getDoctrine()
            ->getManager()->getRepository('BlogBundle:Category')
            ->find($id);

        if (!$category and ($id != 'new')) {
            throw  $this->createNotFoundException();
        }

        if (!$category) {
            $category = new Category();
        }

        $form = $this->createForm(CategoryType::class, $category);
        $form->get('id')->setData($id);

        return [
            'form' => $form->createView(),
            'view_id' => 'category-edit',
            'action' => $this->generateUrl('dt_blog_category_save'),
            'page_title' => $this->get('translator')->trans('Edit Category'),
        ];
    }

    public function dataAction()
    {
        $categories = $this->getDoctrine()->getManager()
            ->getRepository('BlogBundle:Category')->findAll();

        $catArr = [];
        foreach ($categories as $cat) {
            $data = [];
            $data[] = $cat->getId();
            $data[] = $cat->getLabel();
            $data[] = $cat->getDescription();

            $catArr[] = $data;
        }

        $ob = new \StdClass();
        $ob->data = $catArr;
        $ob->recordsTotal = count($catArr);
        $ob->recordsFiltered = count($catArr);

        return new JsonResponse($ob);
    }

    /**
     * @Template()
     */
    public function saveAction(Request $request)
    {
        $requestCat = $request->request->get('category');
        $id = $requestCat['id'];

        $em = $this->getDoctrine()->getManager();
        $category = $em->getRepository('BlogBundle:Category')->find($id);

        if (!$category) {
            $category = new Category();
            $isNew = true;
        }

        $form = $this->createForm(CategoryType::class, $category);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $category = $form->getData();

            $em->persist($category);
            $em->flush();

            $id = $category->getId();

            // log
            $logger = $this->get('logger');
            $logger->info('%author% edited category %category%', ['author' => $this->getUser()->getId(), 'category' => $id]);

            $response = [
                'message' => $this->get('translator')->trans('Category saved'),
                'status' => 'success',
                'id' => $id,
            ];
        } else {
            $errors = [];
            $formView = $form->createView();

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
}
