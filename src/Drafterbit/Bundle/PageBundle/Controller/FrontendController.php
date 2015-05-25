<?php
namespace Drafterbit\Bundle\PageBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drafterbit\Bundle\SystemBundle\Controller\FrontendController as BaseFrontendController;

class FrontendController extends BaseFrontendController
{
	public function viewAction($slug)
	{
		$page = $this->getDoctrine()->getManager()
			->getRepository('DrafterbitPageBundle:Page')->findOneBy(['slug' => $slug]);

		if(!$page) {
			throw $this->createNotFoundException('Page Not Found');
		}

		return $this->render('content/page/view.html', ['page' => $page]);
	}
}