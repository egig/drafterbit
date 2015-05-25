<?php

namespace Drafterbit\Bundle\BlogBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use Drafterbit\Bundle\BlogBundle\Entity\Post;
use Drafterbit\Bundle\BlogBundle\Model\Revision;
use cogpowered\FineDiff\Granularity\Character as CharacterGranularity;
use cogpowered\FineDiff\Render\Html as HtmlRenderer;
use cogpowered\FineDiff\Diff;

/**
 * @Route("/%admin%")
 */
class RevisionController extends Controller
{
	/**
     * @Route("/blog/post/{postId}/revisions", name="drafterbit_blog_revision_view")
     * @Template()
     */
    public function viewAction($postId)
    {
    	$repo = $this->getDoctrine()->getManager()->getRepository('DrafterbitBlogBundle:Post');


    	$revs = $repo->createQueryBuilder('p')
    		->where('p.type = :type')
            ->orderBy('p.createdAt', 'desc')
    		->setParameter('type', 'history:'.$postId)
    		->getQuery()
    		->getResult();

    	$current = $repo->find($postId);

    	for($i=0;$i<count($revs);$i++) {
            $new = ($i-1 < 0) ? $current : $revs[$i-1];
            $old = $revs[$i];

            $revs[$i]->diff_title =(new Diff)->render($old->getTitle(), $new->getTitle());

            $granularity = new CharacterGranularity;
            $renderer = new HtmlRenderer;
            $diff_content = (new Diff($granularity, $renderer))->render($old->getContent(), $new->getContent());

            // add line spacing between paragraph
            $revs[$i]->diff_content = str_replace('&lt;/p&gt;', '&lt;/p&gt;<br/><br/>', $diff_content);

            $revs[$i]->authorUrl = $this->generateUrl('drafterbit_user_edit', ['id' => $revs[$i]->getUser()->getId()]);
            $revs[$i]->pos = count($revs)-$i;
        }

    	$postUrl = '<a href="'.$this->generateUrl('drafterbit_blog_post_edit', ['id' => $current->getId()]).'">'.$current->getTitle()."</a>";
    	return [
    		'post_id' => $postId,
    		'revs' => $revs,
    		'page_title' => $this->get('translator')->trans('Revisions of %post%', ['%post%' => $postUrl])
    	];
    }

    /**
     * @Route("/blog/revision/clear", name="drafterbit_blog_revision_clear")
     * @Template()
     */
    public function clearAction(Request $request)
    {
        $postId = $request->request->get('id');

        $em = $this->getDoctrine()->getManager();
        $revs = $em->getRepository('DrafterbitBlogBundle:Post')->findby(['type' => 'history:'.$postId]);

        foreach ($revs as $rev) {
		    $em->remove($rev);
        }

        $em->flush();

        return new Response;
    }

    /**
     * @Route("/blog/revision/revert", name="drafterbit_blog_revision_revert")
     */
    public function revertAction(Request $request)
    {
        $id = $request->request->get('id');
        $postId = $request->request->get('post-id');

        $em = $this->getDoctrine()->getManager();
    	$repo = $em->getRepository('DrafterbitBlogBundle:Post');

        $rev = $repo->find($id);

        $title = $rev->getTitle();
        $content = $rev->getContent();

        $post = $repo->find($postId);

        (new Revision($this))->create($post->getTitle(), $post->getContent(), $post, TRUE);

        $post->setTitle($title);
        $post->setContent($content);

        $em->persist($post);
        $em->flush();

        return $this->redirect($this->generateUrl('drafterbit_blog_post_edit', ['id' => $postId]));
    }
}