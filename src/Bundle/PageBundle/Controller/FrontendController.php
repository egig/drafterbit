<?php

namespace drafterbit\Bundle\PageBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class FrontendController extends Controller
{
    public function viewAction($slug)
    {
        $page = $this->getDoctrine()->getManager()
            ->getRepository('PageBundle:Page')->findOneBy(['slug' => $slug]);

        if (!$page) {
            throw $this->createNotFoundException('Page Not Found');
        }

        return $this->render('content/page/view.html.twig', ['page' => $page]);
    }
}
