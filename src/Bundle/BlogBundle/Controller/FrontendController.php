<?php

namespace Drafterbit\Bundle\BlogBundle\Controller;

use Doctrine\ORM\Query\Expr;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Drafterbit\Bundle\SystemBundle\Controller\FrontendController as BaseFrontendController;

use Drafterbit\Bundle\BlogBundle\Entity\Comment;
use Drafterbit\Bundle\BlogBundle\Form\Type\CommentType;

class FrontendController extends BaseFrontendController
{
    const MORE_TAG = '<!--more-->';

    /**
     * @Template("content/blog/index.html.twig")
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
     * @Template("content/blog/tag/index.html.twig")
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
     * @Template("content/blog/category/index.html.twig")
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
     * @Template("content/blog/author/index.html.twig")
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

    /**
     * Get pos list for front end view
     *
     * @param int $page
     * @param string $filterKey
     * @param mixed $filterValue
     * @return array
     */
    private function getPostlist($page, $filterKey = null, $filterValue = null)
    {
        $perPage = $this->get('system')->get('blog.post_perpage', 5);
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

        $posts = $query->getQuery()->getResult();

        foreach ($posts as $post) {

            // Create post excerpt
            if(strrpos($post->getContent(), self::MORE_TAG) !== false) {
                $post->excerpt = current(explode(self::MORE_TAG, $post->getContent())).'&hellip;';
            } else {
                $post->excerpt = false;
            }

            // Create post url
            $dateObject = $post->getPublishedAt();
            $year = $dateObject->format('Y');
            $month = $dateObject->format('m');
            $date = $dateObject->format('d');
            $slug = $post->getSlug();
            $post->url = $this->generateUrl('drafterbit_blog_post_front_view',
                ['year' => $year, 'month' => $month, 'date' => $date, 'slug' => $slug]);
        }

        return $posts;
    }

    /**
     * @Template("content/blog/view.html.twig")
     */
    public function viewAction($year, $month, $date, $slug)
    {
        $time = new \DateTime("$year-$month-$date");

        $post = $this->getDoctrine()->getManager()
            ->getRepository('DrafterbitBlogBundle:Post')
            ->createQueryBuilder('p')
            ->where('p.slug=:slug')
            ->andWhere('p.type=:type')
            ->andWhere('p.publishedAt >= :publishedAt')
            ->setParameters(['slug' => $slug, 'type' => 'standard', 'publishedAt' => $time])
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        return ['post'  => $post];
    }
    
    public function commentSubmitAction(Request $request)
    {
        $referer = $request->server->get('HTTP_REFERER');
        $requestedComment = $request->request->get('blog_comment');

        if($parentId = $requestedComment['parent']) {
            $parent = $this->getDoctrine()->getManager()
                ->getRepository('DrafterbitBlogBundle:Comment')
                ->find($parentId);
        } else {
            $parent = null;
        }

        $newComment = new Comment;
        $newComment->setParent($parent);

        $form = $this->createForm(new CommentType, $newComment);
        $form->handleRequest($request);

        if($form->isValid()) {
            $comment = $form->getData();
            $comment->setCreatedAt(new \DateTime);
            $comment->setUpdatedAt(new \DateTime);
            $comment->setDeletedAt(NULL);

            // @todo status
            if($this->get('system')->get('blog.comment_moderation')){
                $comment->setStatus(0);
            } else {
                $comment->setStatus(1);
            }

            $em = $this->getDoctrine()->getManager();
            $em->persist($comment);
            $em->flush();

            $this->sendMails($comment);

            if($this->get('system')->get('blog.comment_moderation')){
                $data['post_url'] = $referer;
                return $this->render('DrafterbitBlogBundle:Comment:pending.html.twig', $data);
            }

            return new RedirectResponse($referer.'#comment-'.$comment->getId());

        } else {
            
            $errors = [];

            // @todo clean this, make a recursive
            // create service, FormErrorExtractor maybe
            $formView = $form->createView();
            
            foreach ($formView as $inputName => $view) {

                if(isset($view->vars['errors'])) {
                    foreach($view->vars['errors'] as $error) {
                        $errors[$view->vars['label']] = $error->getMessage();
                    }
                }
            }

            $data['post_url'] = $referer;
            $data['errors'] = $errors;
            $content = $this->renderView('DrafterbitBlogBundle:Comment:error.html.twig', $data);
            return new Response($content);
        }
    }

    private function sendMails($comment)
    {
        $from = $this->get('system')->get('email');
        $sitename = $this->get('system')->get('sitename');
        $subsribers = $this->getSubscribers($comment->getPost());
        array_unshift($subsribers, $from);
        $subject = $this->get('translator')->trans('New Comment Notification');

        $post = $comment->getPost();

        $year = $post->getPublishedAt()->format('Y');
        $month = $post->getPublishedAt()->format('m');
        $date = $post->getPublishedAt()->format('d');
        $slug = $post->getSlug();
        $post->url = $this->generateUrl('drafterbit_blog_post_front_view',
                ['year' => $year, 'month' => $month, 'date' => $date, 'slug' => $slug], true);

        // @todo create and improve default template
        // @todo make templating also supports bundles view
        $data = [
            'comment' => $comment,
            'post' => $post,
            'unsubscribe_url' => $this->generateUrl('drafterbit_blog_comment_unsubscribe',
                ['email' => $comment->getAuthorEmail()], true)
        ];
        $messageBody = $this->renderView('DrafterbitBlogBundle:Comment:mail.html.twig', $data);

        $message = \Swift_Message::newInstance()
            ->setSubject($subject)
            ->setFrom($from, $sitename)
            ->setTo($subsribers)
            ->setBody($messageBody, 'text/html');

        $this->get('mailer')->send($message);
    }

    private function getSubscribers($post)
    {
        $comments = $post->getComments();

        $subscribers = [];

        foreach ($comments as $comment) {
            if($comment->getSubscribe()) {
                $subscribers[] = $comment->getAuthorEmail();    
            }
        }

        return array_unique($subscribers);
    }

    /**
     * @Route("/blog/comment/unsubscribe/{email}", name="drafterbit_blog_comment_unsubscribe")
     */
    public function commentUnsubscribeAction($email, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        
        $comments = $em->getRepository('DrafterbitBlogBundle:Comment')
            ->findBy(['authorEmail' => $email]);

        foreach ($comments as $comment) {
            $comment->setSubscribe(0);
            $em->persist($comment);
        }

        $em->flush();

        return $this->render('DrafterbitBlogBundle:Comment:unsubscribed.html.twig');
    }
}