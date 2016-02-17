<?php

namespace Drafterbit\Bundle\BlogBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
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

class PostController extends Controller
{
    /**
     * @Template()
     * @Security("is_granted('ROLE_POST_VIEW')")
     *
     * @todo improve indexing (filter by collumn)
     */
    public function indexAction(Request $request)
    {
        $viewId = 'post';
        $em = $this->getDoctrine()->getManager();

        if ($action = $request->request->get('action')) {

            // safety first
            $token = $request->request->get('_token');
            if (!$this->isCsrfTokenValid($viewId, $token)) {
                throw $this->createAccessDeniedException();
            }

            $posts = $request->request->get('posts');

            if (!$posts) {
                return new JsonResponse([
                    'status' => 'error',
                    'message' => $this->get('translator')->trans('Please make selection first'),
                ]);
            }

            foreach ($posts as $id) {
                $post = $em->getRepository('BlogBundle:Post')->find($id);

                switch ($action) {
                    case 'trash':
                        $post->setDeletedAt(new \DateTime());
                        $status = 'warning';
                        $message = 'Post(s) moved to trash';
                        $em->persist($post);
                        break;
                    case 'restore':
                        $post->setDeletedAt(null);
                        $status = 'success';
                        $message = 'Post(s) restored';
                        $em->persist($post);
                        break;
                    case 'delete':

                        // delete the history first
                        $histories = $em->getRepository('BlogBundle:Post')
                            ->getHistories($post->getId());
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

        $categories = $em->getRepository('BlogBundle:Category')->findAll();

        return [
            'view_id' => $viewId,
            'categories' => $categories,
            'page_title' => $this->get('translator')->trans('Post'),
        ];
    }

    /**
     * @Route("/blog/post/data", name="dt_blog_post_data")
     */
    public function dataAction(Request $request)
    {
        $status = $request->query->get('status');
        $categoryId = $request->query->get('category');

        $em = $this->getDoctrine()->getManager();
        $pagesArr = [];

        $posts = $em->getRepository('BlogBundle:Post')->
            getByStatusAndCategory($status, $categoryId);

        foreach ($posts as $post) {
            $data = [];
            $data['id'] = $post->getId();
            $data['title'] = $post->getTitle();
            $data['author'] = $post->getUser()->getRealName();
            $data['user_id'] = $post->getUser()->getId();

            $data['updated_at'] = $post->getUpdatedAt()->format('d F Y H:i');

            $pagesArr[] = $data;
        }

        $ob = new \StdClass();
        $ob->data = $pagesArr;
        $ob->recordsTotal = count($pagesArr);
        $ob->recordsFiltered = count($pagesArr);

        return new JsonResponse($ob);
    }

    /**
     * @Template()
     * @Security("is_granted('ROLE_POST_EDIT')")
     */
    public function editAction($id)
    {
        $pageTitle = 'Edit Post';
        $em = $this->getDoctrine()->getManager();
        $post = $em->getRepository('BlogBundle:Post')->find($id);

        if (!$post and ($id != 'new')) {
            throw  $this->createNotFoundException();
        }

        if (!$post) {
            $post = new Post();
            $pageTitle = 'New Post';
        }

        // @todo use object voter
        // $this->denyAccessUnlessGranted('post.edit', $post);

        $tags = $em->getRepository('BlogBundle:Tag')->findAll();

        $tagOptions = array_map(function ($item) {
            return $item->getLabel();
        }, $tags);

        $postTags = array_map(function ($item) {
            return $item->getLabel();
        }, $post->getTags()->toArray());

        // @todo merge form creation with one defined in saveAction
        $form = $this->createForm(PostType::class, $post);
        $form->get('id')->setData($id);
        $form->get('published_at')->setData($post->getPublishedAt()->format('Y-m-d H:i'));

        $revisions = $this->getRevisions($id);

        $categories = $em->getRepository('BlogBundle:Category')->findAll();

        return [
            'categories' => $categories,
            'tag_options' => json_encode($tagOptions),
            'tags' => json_encode($postTags),
            'form' => $form->createView(),
            'post_id' => $id,
            'view_id' => 'post-edit',
            'revisions' => $revisions,
            'action' => $this->generateUrl('dt_blog_post_save'),
            'page_title' => $this->get('translator')->trans($pageTitle),
        ];
    }

    /**
     * @Template()
     */
    public function saveAction(Request $request)
    {
        $requestPage = $request->request->get('post');
        $id = $requestPage['id'];

        $em = $this->getDoctrine()->getManager();
        $post = $em->getRepository('BlogBundle:Post')->find($id);

        $isNew = false;
        if (!$post) {
            $post = new Post();
            $isNew = true;
        }

        // for revision
        $currentTitle = $post->getTitle();
        $currentContent = $post->getContent();

        // tags needs sparate input
        $tagLabels = $request->request->get('tags');

        if ($tagLabels) {
            foreach ($tagLabels as $label) {
                $tag = $em->getRepository('BlogBundle:Tag')->findOneBy(['label' => $tagLabels]);

                if (!$tag) {
                    $tag = new Tag();
                    $tag->setLabel($label);
                    $tag->setSlug(static::slug($label));

                    $em->persist($tag);
                    $tag;
                }
            }
        }

        $em->flush();

        $tags = $em->getRepository('BlogBundle:Tag')->findBy(['label' => $tagLabels]);
        $post->setTags($tags);

        $form = $this->createForm(PostType::class, $post);
        $form->handleRequest($request);

        if ($form->isValid()) {

            //save data to database
            $post = $form->getData();
            $publishedAt = $form->get('published_at')->getData();

            $post->setUser($this->getUser());
            $post->setUpdatedAt(new \DateTime());
            $post->setPublishedAt(new \DateTime($publishedAt));

            if ($isNew) {
                $post->setCreatedAt(new \DateTime());
                $post->setDeletedAt(null);

                // @todo create revision
                $post->setType(Post::TYPE_STANDARD);
            }

            // create revision first
            if (!$isNew) {
                (new Revision($this->getDoctrine()->getManager(), $this->getUser()))
                    ->create($currentTitle, $currentContent, $post);
            }

            $em->persist($post);
            $em->flush();

            $id = $post->getId();

            // log
            $logger = $this->get('logger');
            $logger->info('%author% edited post %post%', ['author' => $this->getUser()->getId(), 'post' => $id]);

            $response = [
                'message' => $this->get('translator')->trans('Post saved'),
                'status' => 'success',
                'id' => $id, ];
        } else {
            $errors = [];
            foreach ($form->getErrors(true) as $error) {
                $name = $error->getOrigin()->createView()->vars['full_name'];
                $errors[$name] = $error->getMessage();
            }

            $response['error'] = [
                'type' => 'validation',
                'messages' => $errors,
            ];
        }

        return new JsonResponse($response);
    }

    /**
     * Get post revisions.
     *
     * @return array
     */
    public function getRevisions($id)
    {
        $query = $this->getDoctrine()
            ->getManager()->getRepository('BlogBundle:Post')
            ->createQueryBuilder('p')
            ->where('p.type=:type')
            ->setParameter('type', 'history:'.$id)
            ->orderBy('p.createdAt', 'desc')
            ->getQuery();

        return $query->getResult();
    }

    /**
     * Generate a URL friendly "slug" from a given string.
     *
     * @param string $title
     * @param string $separator
     *
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
     * @Template("BlogBundle::setting.html.twig")
     * @Security("is_granted('ROLE_BLOG_SETTING_MANAGE')")
     */
    public function settingAction(Request $request)
    {
        $blogSetting = $request->request->get('blog_setting');

        // @todo validation
        $notif['success'] = false;
        if ($blogSetting) {
            $settingData = [
                'blog.post_perpage' => $blogSetting['post_perpage'],
                'blog.feed_shows' => $blogSetting['feed_shows'],
                'blog.feed_content' => $blogSetting['feed_content'],
                'blog.comment_moderation' => $blogSetting['comment_moderation'],
            ];
            $this->get('system')->update($settingData);
            $notif['success'] = [
                'message' => 'Setting saved',
            ];
        }

        $form = $this->createForm(new SettingType($this->get('system')));
        $data = [
            'action' => $this->generateUrl('dt_blog_setting'),
            'view_id' => 'blog_setting',
            'page_title' => $this->get('translator')->trans('Blog Setting'),
            'form' => $form->createView(),
        ];

        return $data + $notif;
    }
}
