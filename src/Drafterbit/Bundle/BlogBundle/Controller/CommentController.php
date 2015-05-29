<?php

namespace Drafterbit\Bundle\BlogBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

/**
 * @Route("/%admin%")
 */
class CommentController extends Controller
{
	/**
     * @Route("/blog/comment", name="drafterbit_blog_comment")
     * @Template()
     * @Security("is_granted('ROLE_COMMENT_VIEW')")
     */
    public function indexAction()
    {
    	return [
            'view_id' => 'comments',
            'page_title' => $this->get('translator')->trans('Comment')
        ];
    }

    /**
     * @Route("/blog/comment/data/{status}", name="drafterbit_blog_comment_data")
     */
    public function dataAction($status)
    {
        $comments = $this->getDoctrine()->getManager()
            ->getRepository('DrafterbitBlogBundle:Comment')
            ->createQueryBuilder('c')
            //->where('status=:status')
            //->setParameter('status', $status)
            ->getQuery()
            ->getResult();

        $arr  = [];

        foreach ($comments as $comment) {
            $data = [];
            $data[] = "<input type=\"checkbox\" name=\"comments[]\" value=\"{$comment->getId()}\">";
            $data[] = '<img alt="" src="'.$this->gravatarUrl($comment->getAuthorEmail()).'"/>'.$comment->getAuthorName().'<br/><a href="mailto:'.$comment->getAuthorName().'">'.$comment->getAuthorEmail().'</a>';

            $data[] = $this->contentFormat($comment->getContent(), $comment);;

            $data[] = '<a href="'.$this->generateUrl('drafterbit_blog_post_edit', ['id' => $comment->getPost()->getId()]).'">'
                .$comment->getPost()->getTitle().'</a><br/>'.$comment->getCreatedAt()->format('d/m/Y');

            $arr[] = $data;
        }

        $ob = new \StdClass;
        $ob->data = $arr;
        $ob->recordsTotal= count($arr);
        $ob->recordsFiltered = count($arr);

        return new JsonResponse($ob);
    }

    public function gravatarUrl($email, $size = 47)
    {
        $hash = md5(strtolower($email));
        return "http://www.gravatar.com/avatar/$hash?d=mm&s=$size";
    }

    private function contentFormat($content, $item)
    {
        $data['content'] = $content;
        $data['itemId'] = $item->getId();
        $data['postId'] = $item->getPost()->getId();
        $data['status'] = $item->getStatus();
        $data['deletedAt'] = $item->getDeletedAt();

        if ($data['status']) {
            $data['display'] = $data['status'] == 1 ? 'inline' : 'none';
            $data['display2'] = $data['status'] == 0 ? 'inline' : 'none';
        }

        return $this->renderView('DrafterbitBlogBundle:Comment:item.html.twig', $data);
    }
}