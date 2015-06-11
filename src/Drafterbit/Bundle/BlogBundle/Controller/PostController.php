<?php

namespace Drafterbit\Bundle\BlogBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

use Drafterbit\Bundle\BlogBundle\Form\Type\PostType;
use Drafterbit\Bundle\BlogBundle\Form\Type\SettingType;
use Drafterbit\Bundle\BlogBundle\Entity\Post;
use Drafterbit\Bundle\BlogBundle\Entity\Tag;
use Drafterbit\Bundle\BlogBundle\Model\Revision;

use Doctrine\Common\Collections\ArrayCollection;

/**
 * @Route("/%admin%")
 */
class PostController extends Controller
{
    /**
     * @Route("/blog/post", name="drafterbit_blog_post")
     * @Template()
     * @Security("is_granted('ROLE_POST_VIEW')")
     * @todo improve indexing (filter by collumn)
     */
    public function indexAction(Request $request)
    {
        $viewId = 'post';
        $em = $this->getDoctrine()->getManager();

        if($action = $request->request->get('action')) {

            // safety first
            $token = $request->request->get('_token');
            if(!$this->isCsrfTokenValid($viewId, $token)) {
                throw $this->createAccessDeniedException();
            }
            
            $posts = $request->request->get('posts');

            if(!$posts) {
                return new JsonResponse([
                    'status' => 'error',
                    'message' => $this->get('translator')->trans('Please make selection first')
                ]);
            }


             foreach ($posts as $id) {
                $post = $em->getRepository('DrafterbitBlogBundle:Post')->find($id);

                switch ($action) {
                    case 'trash':
                        $post->setDeletedAt(new \DateTime());
                        $status = 'warning';
                        $message = 'Post(s) moved to trash';
                        $em->persist($post);
                        break;
                    case 'restore':
                        // @todo change deleted_at to null
                        // 0000-00-00 is not valid
                        $post->setDeletedAt(new \DateTime('0000-00-00'));
                        $status = 'success';
                        $message = 'Post(s) restored';
                        $em->persist($post);
                        break;
                    case 'delete':

                        // delete the history first
                        $histories = $em->getRepository('DrafterbitBlogBundle:Post')
                            ->createQueryBuilder('p')
                            ->where('p.type  = :type')
                            ->setParameter('type', "history:".$post->getId())
                            ->getQuery()->getResult();
                        foreach ($histories as $history) {
                            $em->remove($history);
                        }

                        $em->remove($post);

                        $status = 'success';
                        $message = 'Post(s) deleted permanently';
                        break;
                    default:
                        break;
                }

                $em->flush();
            }

            return new JsonResponse([
                'status' => $status,
                'message' => $this->get('translator')->trans($message),
                ]);
        }

        return [
            'view_id' => $viewId,
            'page_title' => $this->get('translator')->trans('Post')
        ];
    }

    /**
     * @Route("/blog/post/data/{status}", name="drafterbit_blog_post_data")
     * @Template()
     */
    public function dataAction($status)
    {
        $filter = ['type' => 'standard'];

        $pagesArr  = [];
        $query = $this->getDoctrine()
            ->getManager()
            ->getRepository('DrafterbitBlogBundle:Post')
            ->createQueryBuilder('p')
            ->where("p.type = 'standard'");

        if($status == 'trashed') {
            $query->andWhere("p.deletedAt != '0000-00-00 00:00'");
        } else {
            $query->andWhere("p.deletedAt = '0000-00-00 00:00'");
            switch ($status) {
                case 'all':
                    break;
                case 'published':
                    $query->andWhere('p.status = 1');
                    break;
                case 'pending':
                    $query->andWhere('p.status = 0');
                    break;
                default:
                    break;
            }
        }
        
        $posts = $query->getQuery()->getResult();

        foreach ($posts as $post) {
            $data = [];
            $data['id'] = $post->getId();;
            $data['title'] = $post->getTitle();
            $data['author'] = $post->getUser()->getRealName();
            $data['user_id'] = $post->getUser()->getId();

            $data['updated_at'] = $post->getUpdatedAt()->format('d F Y H:i');

            $pagesArr[] = $data;
        }

        $ob = new \StdClass;
        $ob->data = $pagesArr;
        $ob->recordsTotal= count($pagesArr);
        $ob->recordsFiltered = count($pagesArr);

        return new JsonResponse($ob);
    }

    /**
     * @Route("/blog/post/edit/{id}", name="drafterbit_blog_post_edit")
     * @Template()
     * @Security("is_granted('ROLE_POST_EDIT')")
     */
    public function editAction($id)
    {
        $pageTitle = 'Edit Post';
        $em = $this->getDoctrine()->getManager();
        $post = $em->getRepository('DrafterbitBlogBundle:Post')->find($id);

        if(!$post and ($id != 'new')) {
            throw  $this->createNotFoundException();
        }

        if(!$post) {
            $post = new Post(); 
            $pageTitle = 'New Post';
        }

        // @todo use object voter
        // $this->denyAccessUnlessGranted('post.edit', $post);

        $tags = $em->getRepository('DrafterbitBlogBundle:Tag')->findBy(['id']);

        $tagOptions = array_map(function($item) {
            return $item->getLabel();
        }, $tags);


        $postTags = array_map(function($item) {
            return $item->getLabel();
        }, $post->getTags()->toArray());


        // @todo merge form creation with one defined in saveAction
        $form = $this->createForm(new PostType(), $post);
        $form->get('id')->setData($id);
        $form->get('published_at')->setData($post->getPublishedAt()->format('Y-m-d H:i'));

        $revisions = $this->getRevisions($id);

        $categories = $em->getRepository('DrafterbitBlogBundle:Category')->findAll();

        return [
            'categories' => $categories,
            'tag_options' => json_encode($tagOptions),
            'tags' => json_encode($postTags),
            'form' => $form->createView(),
            'post_id' => $id,
            'view_id' => 'post-edit',
            'revisions' => $revisions,
            'action' =>  $this->generateUrl('drafterbit_blog_post_save'),
            'page_title' => $this->get('translator')->trans($pageTitle)
        ];
    }

    /**
     * @Route("/blog/post/save", name="drafterbit_blog_post_save")
     * @Template()
     */
    public function saveAction(Request $request)
    {
        $requestPage = $request->request->get('blog_post');
        $id = $requestPage['id'];

        $em = $this->getDoctrine()->getManager();
        $post = $em->getRepository('DrafterbitBlogBundle:Post')->find($id);

        $isNew = false;
        if(!$post) {
            $post = new Post();
            $isNew = true;
        }

        // for revision
        $currentTitle = $post->getTitle();
        $currentContent = $post->getContent();

        // tags needs sparate input
        $tagLabels = $request->request->get('tags');
        
        if($tagLabels) {
            foreach ($tagLabels as $label) {
                $tag = $em->getRepository('DrafterbitBlogBundle:Tag')->findOneBy(['label' => $tagLabels]);

                if(!$tag) {
                    $tag = new Tag;
                    $tag->setLabel($label);
                    $tag->setSlug(static::slug($label));

                    $em->persist($tag);
                    $tag;
                }
            }
        }

        $em->flush();

        $tags = $em->getRepository('DrafterbitBlogBundle:Tag')->findBy(['label' => $tagLabels]);
        $post->setTags($tags);

        $form = $this->createForm(new PostType(), $post);
        $form->handleRequest($request);

         if($form->isValid()) {

            //save data to database
            $post = $form->getData();
            $publishedAt = $form->get('published_at')->getData();

            $post->setUser($this->getUser());
            $post->setUpdatedAt(new \DateTime);
            $post->setPublishedAt(new \DateTime($publishedAt));

            if($isNew) {
                $post->setCreatedAt(new \DateTime);
                $post->setDeletedAt(new \DateTime('0000-00-00'));

                // @todo create revision
                $post->setType('standard');
            }

            // create revision first
            if(!$isNew) {
                (new Revision($this))->create($currentTitle, $currentContent, $post);
            }

            $em->persist($post);
            $em->flush();

            $id = $post->getId();

            // log
            $logger = $this->get('logger');
            $logger->info(':user:'.$this->getUser()->getId().' edited Post :post:'.$id, ['id' => $id]);

            $response = [
                'message' => $this->get('translator')->trans('Post saved'),
                'status' => 'success',
                'id' => $id];
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

    /**
     * Get post revisions
     *
     * @return array
     */
    public function getRevisions($id)
    {
        $query = $this->getDoctrine()
            ->getManager()->getRepository('DrafterbitBlogBundle:Post')
            ->createQueryBuilder('p')
            ->where('p.type=:type')
            ->setParameter('type', "history:".$id)
            ->orderBy('p.createdAt', 'desc')
            ->getQuery();
        
        return $query->getResult();
    }

    /**
     * Generate a URL friendly "slug" from a given string.
     *
     * @param string $title
     * @param string $separator
     * @return string
     */
    public static function slug($title, $separator = '-')
    {
        // Convert all dashes/underscores into separator
        $flip = $separator == '-' ? '_' : '-';
        $title = preg_replace('!['.preg_quote($flip).']+!u', $separator, $title);
        
        // Remove all characters that are not the separator, letters, numbers, or whitespace.
        $title = preg_replace('![^'.preg_quote($separator).'\pL\pN\s]+!u', '', mb_strtolower($title));
        
        // Replace all separator characters and whitespace by a single separator
        $title = preg_replace('!['.preg_quote($separator).'\s]+!u', $separator, $title);
        return trim($title, $separator);
    }

    /**
     * @Route("/setting/blog", name="drafterbit_blog_setting")
     * @Template("DrafterbitBlogBundle::setting.html.twig")
     * @Security("is_granted('ROLE_BLOG_SETTING_MANAGE')")
     */
    public function settingAction(Request $request)
    {
        $blogSetting = $request->request->get('blog_setting');

        // @todo validation
        $notif['success'] = false;
        if($blogSetting) {       
            $settingData = [
                'blog.post_perpage' => $blogSetting['post_perpage'],
                'blog.feed_shows' => $blogSetting['feed_shows'],
                'blog.feed_content' => $blogSetting['feed_content'],
                'blog.comment_moderation' => $blogSetting['comment_moderation']
            ];
            $this->get('system')->update($settingData);
            $notif['success'] = [
                'message' => 'Setting saved'
            ];
        }

        $form = $this->createForm(new SettingType($this->get('system')));
        $data =  [
            'action' => $this->generateUrl('drafterbit_blog_setting'),
            'view_id' => 'blog_setting',
            'page_title' => $this->get('translator')->trans('Blog Setting'),
            'form' => $form->createView()
        ];

        return $data+$notif;
    }

    public function feedAction()
    {        
        $shows = $this->get('system')->get('blog.feed_shows', 10);

        $posts = $this->getDoctrine()->getManager()
            ->getRepository('DrafterbitBlogBundle:Post')
            ->createQueryBuilder('p')
            ->where("p.type = 'standard'")
            ->setMaxResults($shows)
            ->getQuery()
            ->getResult();

        $data['posts'] = $this->formatFeeds($posts);

        $content =  $this->renderView('DrafterbitBlogBundle::feed.xml.twig', $data);

        // Fixes short opentag issue
        $content = '<?xml version="1.0" encoding="UTF-8"?>'.$content;

        $response = new Response($content);
        $response->headers->set('Content-Type', 'application/xml');
        return $response;
    }

    private function formatFeeds($posts)
    {
        foreach ($posts as &$post) {
            $date = $post->getCreatedAt()->format('Y/m/d');

            $post->date = $post->getCreatedAt()->format('d F Y H:i:s');

            $post->url = $date.'/'.$post->getSlug();
            
            if (strpos($post->getContent(), '<!--more-->') !== false) {
                $content = str_replace('<!--more-->', '', $post->getContent());
                $post->setContent($content);
            }

            $feedsContent = $this->get('system')->get('blog.feed_content', 1);

            $text = $post->getContent();

            if($feedsContent == 2) {
                $post->feed_content = substr($text, 0, 250).( strlen($text) > 250 ? '&hellip;' : '');
            } else {
                $post->feed_content = $text;
            }
        }

        return $posts;
    }
}