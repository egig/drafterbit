<?php
namespace Drafterbit\Bundle\PageBundle\Controller\Site;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class FrontendController extends Controller
{
    public function viewAction($slug)
    {
        $page = $this->getDoctrine()->getManager()
            ->getRepository('PageBundle:Page')->findOneBy(['slug' => $slug]);

        if(!$page) {
            throw $this->createNotFoundException('Page Not Found');
        }

        return $this->render('content/page/view.html.twig', ['page' => $page]);
    }
}