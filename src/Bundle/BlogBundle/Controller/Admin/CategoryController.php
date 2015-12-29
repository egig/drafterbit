<?php

namespace Drafterbit\Bundle\BlogBundle\Controller\Admin;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Drafterbit\Bundle\BlogBundle\Form\Type\CategoryType;
use Drafterbit\Bundle\BlogBundle\Entity\Category;

class CategoryController extends Controller
{
    /**
     * @Route("/blog/category", name="dt_blog_category")
     * @Template()
     * @Security("is_granted('ROLE_CATEGORY_VIEW')")
     */
    public function indexAction()
    {
        return [
            'view_id' => 'category',
            'page_title' => $this->get('translator')->trans('Category')
        ];
    }

    /**
     * @Route("/blog/category/edit/{id}", name="dt_blog_category_edit")
     * @Template()
     * @Security("is_granted('ROLE_CATEGORY_EDIT')")
     */
    public function editAction($id, Request $request)
    {
        $category = $this
            ->getDoctrine()
            ->getManager()->getRepository('BlogBundle:Category')
            ->find($id);

        if(!$category and ($id != 'new')) {
            throw  $this->createNotFoundException();
        }

        if(!$category) {
            $category = new Category;
        }

        $form = $this->createForm(new CategoryType, $category);
        $form->get('id')->setData($id);

        return [
            'form' => $form->createView(),
            'view_id' => 'category-edit',
            'action' => $this->generateUrl('dt_blog_category_save'),
            'page_title' => $this->get('translator')->trans('Edit Category')
        ];
    }

    /**
     * @Route("/blog/category/data/all", name="dt_blog_category_data")
     */
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

        $ob = new \StdClass;
        $ob->data = $catArr;
        $ob->recordsTotal= count($catArr);
        $ob->recordsFiltered = count($catArr);

        return new JsonResponse($ob);
    }

    /**
     * @Route("/blog/category/save", name="dt_blog_category_save")
     * @Template()
     */
    public function saveAction(Request $request)
    {
        $requestCat = $request->request->get('blog_category');
        $id = $requestCat['id'];

        $em = $this->getDoctrine()->getManager();
        $category = $em->getRepository('BlogBundle:Category')->find($id);

        if(!$category) {
            $category = new Category();
            $isNew = true;
        }

        $form = $this->createForm(new CategoryType(), $category);
        $form->handleRequest($request);

        if($form->isValid()) {

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
                'id' => $id
            ];
        } else {

            $errors = [];
            $formView = $form->createView();

            // @todo clean this, make a recursive
            // create service, FormErrorExtractor maybe
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