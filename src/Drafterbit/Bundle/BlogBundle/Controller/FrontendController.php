<?php

namespace Drafterbit\Bundle\BlogBundle\Controller;

use Doctrine\ORM\Query\Expr;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Drafterbit\Bundle\SystemBundle\Controller\FrontendController as BaseFrontendController;

class FrontendController extends BaseFrontendController
{
	/**
	 * @Template("content/blog/index.html")
	 */
	public function indexAction(Request $request)
	{
		$page = $request->query->get('p', 1);
        $posts = $this->getPostlist($page);

        $data['posts'] = $posts;
        $data['pagination'] = $this->getPagination($page, $request);
		return $data;
	}
	/**
	 * @Template("content/blog/tag/index.html")
	 */
	public function tagAction($slug, Request $request)
	{
		$page = $request->query->get('p', 1);

		$posts = $this->getPostlist($page, 'tag', $slug);
	    $data['tag'] = $posts[0]->getTags()[0];
	    $data['posts'] = $posts;
        $data['pagination'] = $this->getPagination($page, $request, 'category', $slug);

		return $data;
	}

	/**
	 * @Template("content/blog/category/index.html")
	 */
	public function categoryAction($slug, Request $request)
	{
		$page = $request->query->get('p', 1);

		$posts = $this->getPostlist($page, 'category', $slug);
	    $data['category'] = $posts[0]->getCategories()[0];
	    $data['posts'] = $posts;
        $data['pagination'] = $this->getPagination($page, $request, 'category', $slug);

		return $data;
	}

	/**
	 * @Template("content/blog/author/index.html")
	 */
	public function authorAction($username, Request $request)
	{
		$page = $request->query->get('p', 1);

		$posts = $this->getPostlist($page, 'author', $username);
	    $data['user'] = $posts[0]->getUser();
	    $data['posts'] = $posts;
        $data['pagination'] = $this->getPagination($page, $request, 'author', $username);

		return $data;
	}

	private function getPagination($page, $request, $filterKey = null, $filterValue = null)
	{
		$data['prev'] = false;
        $data['next'] = false;

        if ($page > 1) {
            if($page == 2) {
                $data['prev'] = $request->getSchemeAndHttpHost().$request->getBaseUrl().$request->getPathInfo();
            } else {
                $data['prev'] = $this->createPageUrl($page-1, $request);
            }
        }

        if ((boolean) count($this->getPostlist($page+1, $filterKey, $filterValue))) {
            $data['next'] = $this->createPageUrl($page+1, $request);
        }

        return $data;
	}

	private function createPageUrl($page, $request)
	{
		if (null !== $qs = $request->getQueryString()) {
           $qs = '?'.$qs;
		   $qs .= '&p='.$page;
        } else {
		   $qs .= '?p='.$page;
        }

        return $request->getSchemeAndHttpHost().$request->getBaseUrl().$request->getPathInfo().$qs;
	}

	private function getPostlist($page, $filterKey = null, $filterValue = null)
	{
        // @todo save this in config
		$perPage = 5;
        $offset = ($page*$perPage)-$perPage;

		$query = $this->getDoctrine()->getManager()
			->getRepository('DrafterbitBlogBundle:Post')
			->createQueryBuilder('p')
			->where("p.type = 'standard'")
			->setMaxResults($perPage)
			->setFirstResult($offset);

		if($filterKey == 'tag') {
			$query->innerJoin('p.tags', 't', Expr\Join::WITH, "t.slug = '$filterValue'");
		}

		if($filterKey == 'category') {
			$query->innerJoin('p.categories', 'c', Expr\Join::WITH, "c.slug = '$filterValue'");
		}

		if($filterKey == 'author') {
			$query->innerJoin('p.user', 'u', Expr\Join::WITH, "u.username = '$filterValue'");
		}

		return $query->getQuery()->getResult();
	}

	/**
	 * @Template("content/blog/view.html")
	 */
	public function viewAction($year, $month, $date, $slug)
	{
		// @todo filter by year month and date
		$post = $this->getDoctrine()->getManager()
			->getRepository('DrafterbitBlogBundle:Post')
			->findOneBy(['slug' => $slug]);

		return ['post'  => $post];
	}
}