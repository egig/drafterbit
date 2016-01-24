<?php

namespace Drafterbit\Bundle\BlogBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Drafterbit\Bundle\BlogBundle\Entity\Comment;
use Drafterbit\Bundle\BlogBundle\Form\Type\CommentType;

class FrontendController extends Controller
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

        if (!$posts) {
            throw $this->createNotFoundException();
        }

        $data['tag'] = $posts[0]->getTags()[0];
        $data['posts'] = $posts;
        $data['pagination'] = $this->getPagination($page, $request, 'tag', $slug);

        return $data;
    }

    /**
     * @Template("content/blog/category/index.html.twig")
     */
    public function categoryAction($slug, Request $request)
    {
        $page = $request->query->get('p', 1);

        $posts = $this->getPostlist($page, 'category', $slug);

        if (!$posts) {
            throw $this->createNotFoundException();
        }

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

        if (!$posts) {
            throw $this->createNotFoundException();
        }

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
            if ($page == 2) {
                $data['prev'] = $request->getSchemeAndHttpHost().$request->getBaseUrl().$request->getPathInfo();
            } else {
                $data['prev'] = $this->createPageUrl($page - 1, $request);
            }
        }

        if ((boolean) count($this->getPostlist($page + 1, $filterKey, $filterValue))) {
            $data['next'] = $this->createPageUrl($page + 1, $request);
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
     * Get pos list for front end view.
     *
     * @param int    $page
     * @param string $filterKey
     * @param mixed  $filterValue
     *
     * @return array
     */
    private function getPostlist($page, $filterKey = null, $filterValue = null)
    {
        $perPage = $this->get('system')->get('blog.post_perpage', 5);

        if ($perPage === '') {
            throw new \RuntimeException('Blog Post per Page configuration detected as empty string,
                it could be someone changes database value or validation does not work when system setting save.');
        }

        $repo = $this->getDoctrine()->getManager()->getRepository('BlogBundle:Post');

        switch ($filterKey) {
            case 'tag':
                $posts = $repo->getByTag($filterValue, $page, $perPage);
                break;
            case 'category':
                $posts = $repo->getByCategory($filterValue, $page, $perPage);
                break;
            case 'author':
                $posts = $repo->getByAuthor($filterValue, $page, $perPage);
                break;
            default:
                $posts = $repo->getStandard($page, $perPage);
                break;
        }

        foreach ($posts as $post) {

            // Create post excerpt
            if (strrpos($post->getContent(), self::MORE_TAG) !== false) {
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
            $post->url = $this->generateUrl('dt_blog_post_front_view',
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
            ->getRepository('BlogBundle:Post')
            ->createQueryBuilder('p')
            ->where('p.slug=:slug')
            ->andWhere('p.type=:type')
            ->andWhere('p.publishedAt >= :publishedAt')
            ->setParameters(['slug' => $slug, 'type' => 'standard', 'publishedAt' => $time])
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        return ['post' => $post];
    }

    /**
     * Comment Submission controller.
     *
     * @Route("/comment/submit", name="dt_blog_comment_submit")
     *
     * @param Request $request
     **/
    public function commentSubmitAction(Request $request)
    {
        $referer = $request->server->get('HTTP_REFERER');
        $requestedComment = $request->request->get('comment');

        if ($parentId = $requestedComment['parent']) {
            $parent = $this->getDoctrine()->getManager()
                ->getRepository('BlogBundle:Comment')
                ->find($parentId);
        } else {
            $parent = null;
        }

        $newComment = new Comment();
        $newComment->setParent($parent);

        $form = $this->createForm(CommentType::class, $newComment);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $comment = $form->getData();
            $comment->setCreatedAt(new \DateTime());
            $comment->setUpdatedAt(new \DateTime());
            $comment->setDeletedAt(null);

            // @todo status
            if ($this->get('system')->get('blog.comment_moderation')) {
                $comment->setStatus(0);
            } else {
                $comment->setStatus(1);
            }

            $em = $this->getDoctrine()->getManager();
            $em->persist($comment);
            $em->flush();

            $this->sendMails($comment);

            if ($this->get('system')->get('blog.comment_moderation')) {
                $data['post_url'] = $referer;

                return $this->render('BlogBundle:Comment:pending.html.twig', $data);
            }

            return new RedirectResponse($referer.'#comment-'.$comment->getId());
        } else {
            $errors = [];
            foreach ($form->getErrors(true) as $error) {
                $name = $error->getOrigin()->createView()->vars['label'];
                $errors[$name] =  $error->getMessage();
            }

            $data['post_url'] = $referer;
            $data['errors'] = $errors;
            $content = $this->renderView('BlogBundle:Comment:error.html.twig', $data);

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
        $post->url = $this->generateUrl('dt_blog_post_front_view',
                ['year' => $year, 'month' => $month, 'date' => $date, 'slug' => $slug], true);

        // @todo create and improve default template
        // @todo make templating also supports bundles view
        $data = [
            'comment' => $comment,
            'post' => $post,
            'unsubscribe_url' => $this->generateUrl('dt_blog_comment_unsubscribe',
                ['email' => $comment->getAuthorEmail()], true),
        ];
        $messageBody = $this->renderView('BlogBundle:Comment:mail.html.twig', $data);

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
            if ($comment->getSubscribe()) {
                $subscribers[] = $comment->getAuthorEmail();
            }
        }

        return array_unique($subscribers);
    }

    public function commentUnsubscribeAction($email, Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $comments = $em->getRepository('BlogBundle:Comment')
            ->findBy(['authorEmail' => $email]);

        foreach ($comments as $comment) {
            $comment->setSubscribe(0);
            $em->persist($comment);
        }

        $em->flush();

        return $this->render('BlogBundle:Comment:unsubscribed.html.twig');
    }
}
