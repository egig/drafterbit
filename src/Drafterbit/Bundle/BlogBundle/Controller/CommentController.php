<?php

namespace Drafterbit\Bundle\BlogBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

use Drafterbit\Bundle\BlogBundle\Entity\Comment;

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
        $query = $this->getDoctrine()->getManager()
            ->getRepository('DrafterbitBlogBundle:Comment')
            ->createQueryBuilder('c');

        if($status == 'trashed') {
            $query->where('c.deletedAt!=:deletedAt');
            $query->setParameter('deletedAt', '0000-00-00 00:00');

        } else {
            $query->where('c.deletedAt=:deletedAt');
            $query->setParameter('deletedAt', '0000-00-00 00:00');
            switch ($status) {
                case 'active':
                    $query->andWhere('c.status!=:status');
                    $query->setParameter('status', Comment::STATUS_SPAM);
                    break;
                case 'pending':
                    $query->andWhere('c.status=:status');
                    $query->setParameter('status', Comment::STATUS_PENDING);
                    break;
                case 'approved':
                    $query->andWhere('c.status=:status');
                    $query->setParameter('status', Comment::STATUS_APPROVED);
                    break;
                case 'spam':
                    $query->andWhere('c.status=:status');
                    $query->setParameter('status', Comment::STATUS_SPAM);
                    break;
                default:
                    break;
            }
        }

        $comments = $query->getQuery()
            ->getResult();

        $arr  = [];

        // @todo move this formatting to js
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
        $data['item_id'] = $item->getId();
        $data['post_id'] = $item->getPost()->getId();
        $data['status'] = $item->getStatus();

        if ($data['status'] != Comment::STATUS_SPAM) {
            $data['display'] = $data['status'] == Comment::STATUS_APPROVED ? 'inline' : 'none';
            $data['display2'] = $data['status'] == Comment::STATUS_PENDING ? 'inline' : 'none';
        }

        $data['STATUS_SPAM'] = Comment::STATUS_SPAM;
        return $this->renderView('DrafterbitBlogBundle:Comment:item.html.twig', $data);
    }

    /**
     * @Route("/blog/comment/status", name="drafterbit_blog_comment_status")
     */
    public function statusAction(Request $request)
    {
        $id = $request->request->get('id');
        $status = $request->request->get('status');

        $em = $this->getDoctrine()->getManager();
        $comment = $em->getRepository('DrafterbitBlogBundle:Comment')
            ->find($id);

        $comment->setStatus($status);
        $em->persist($comment);
        $em->flush();

        return new Response();
    }

    /**
     * @Route("/blog/comment/quick-reply", name="drafterbit_blog_comment_quickreply")
     */
    public function quickReply(Request $request)
    {
        $postId   = $request->request->get('postId');
        $content   = $request->request->get('comment');
        $parentId = $request->request->get('parentId');

        $em = $this->getDoctrine()->getManager();

        $post = $em->getRepository('DrafterbitBlogBundle:Post')->find($postId);
        $parent = $em->getRepository('DrafterbitBlogBundle:Comment')->find($parentId);

        $comment = new Comment;
        $author = $this->getUser();
        $comment->setAuthorName($author->getRealName());
        $comment->setAuthorEmail($author->getEmail());
        $comment->setAuthorUrl($author->getUrl());
        $comment->setContent($content);
        $comment->setPost($post);
        $comment->setParent($parent);
        $comment->setCreatedAt(new \DateTime);
        $comment->setUpdatedAt(new \DateTime);
        $comment->setDeletedAt(new \DateTime('0000-00-00'));
        $comment->setStatus(Comment::STATUS_APPROVED);
        $comment->setSubscribe(0);

        $em->persist($comment);
        $em->flush();

        return new JsonResponse(['msg' => 'Comment saved', 'status' => 'success']);
    }

    /**
     * @Route("/blog/comment/quick-trash", name="drafterbit_blog_comment_quicktrash")
     */
    public function quickTrash(Request $request)
    {
        $id = $request->request->get('id');
        $em = $this->getDoctrine()->getManager();
        $comment = $em->getRepository('DrafterbitBlogBundle:Comment')->find($id);
        $comment->setDeletedAt(new \DateTime);
        $em->persist($comment);
        $em->flush();

        return new JsonResponse(['msg' => 'Comment moved to trash', 'status' => 'warning']);
    }
}