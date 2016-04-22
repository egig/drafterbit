<?php

namespace Drafterbit\Bundle\BlogBundle\Twig\Extension;

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Drafterbit\Bundle\SystemBundle\Twig\Extension\FrontendExtension;
use Drafterbit\Bundle\BlogBundle\Entity\Post;
use Drafterbit\Bundle\BlogBundle\Form\Type\CommentType;
use Drafterbit\Bundle\BlogBundle\Entity\Comment;

class BlogExtension extends \Twig_Extension
{
    const CATEGORY_ROUTE_NAME = 'dt_blog_category_front_view';
    const TAG_ROUTE_NAME = 'dt_blog_tag_front_view';
    const AUTHOR_ROUTE_NAME = 'dt_blog_author_front_view';

    protected $kernel;

    public function __construct(Kernel $kernel)
    {
        $this->kernel = $kernel;
    }

    public function getFunctions()
    {
        return array(
            new \Twig_SimpleFunction('blog_url', array($this, 'blogUrl')),
            new \Twig_SimpleFunction('blog_category_url', array($this, 'blogCategoryUrl')),
            new \Twig_SimpleFunction('blog_tag_url', array($this, 'blogTagUrl')),
            new \Twig_SimpleFunction('blog_author_url', array($this, 'blogAuthorUrl')),
            new \Twig_SimpleFunction('comment', array($this, 'comment')),
        );
    }

    public function comment(Post $post = null)
    {
        $container = $this->kernel->getContainer();

        $comments = $container->get('doctrine')
            ->getManager()
            ->getRepository('BlogBundle:Comment')
            ->createQueryBuilder('c')
            ->where('c.post=:post')
            ->andWhere('c.status = 1')
            ->andWhere('c.deletedAt is null')
            ->setParameter('post', $post)
            ->getQuery()
            ->getResult();

        $data['comments'] = $comments;

        $content = $this->renderComments($comments);

        $jsCommentSnippet = $this->kernel
            ->getBundle('BlogBundle')
            ->getPath().'/Resources/js/comment/front-snippet.js';

        $js = '<script>'.file_get_contents($jsCommentSnippet).'</script>';

        $form = $this->kernel->getContainer()->get('form.factory')->create(CommentType::class);
        $form->get('post')->setData($post);

        $formSection = $this->kernel->getContainer()->get('templating')->render('content/blog/comment/form.html.twig',
            [
                'form' => $form->createView(),
                'parent' => null,
                'form_id' => 'form-comment-0',
            ]);

        return $content.$formSection.$js;
    }

    public function blogUrl($path)
    {
        $path = trim($path, '/');

        $frontpage = $this->kernel->getContainer()->get('system')->get('system.frontpage');

        if ($frontpage != 'blog') {
            $path = 'blog/'.$path;
        }

        return (new FrontendExtension($this->kernel))->baseUrl($path);
    }

    public function blogCategoryUrl($slug, $referenceType = UrlGeneratorInterface::ABSOLUTE_PATH)
    {
        $container = $this->kernel->getContainer();
        $parameters['slug'] = $slug;

        return $container->get('router')->generate(static::CATEGORY_ROUTE_NAME, $parameters, $referenceType);
    }

    public function blogTagUrl($slug, $referenceType = UrlGeneratorInterface::ABSOLUTE_PATH)
    {
        $container = $this->kernel->getContainer();
        $parameters['slug'] = $slug;

        return $container->get('router')->generate(static::TAG_ROUTE_NAME, $parameters, $referenceType);
    }

    public function blogAuthorUrl($username, $referenceType = UrlGeneratorInterface::ABSOLUTE_PATH)
    {
        $container = $this->kernel->getContainer();
        $parameters['username'] = $username;

        return $container->get('router')->generate(static::AUTHOR_ROUTE_NAME, $parameters, $referenceType);
    }

    /**
     * Render comments reqursively.
     */
    private function renderComments($comments, $parent = null)
    {
        $content = '';
        foreach ($comments as $comment) {
            if ($comment->getParent() == $parent) {
                $newComment = new Comment();
                $newComment->setParent($comment);
                $form = $this->kernel->getContainer()->get('form.factory')->create(CommentType::class, $newComment);
                $form->get('post')->setData($comment->getPost());

                $data['form'] = $form->createView();
                $data['parent'] = $comment;
                $data['form_id'] = 'form-comment-'.$comment->getId();

                $comment->form = $this->kernel->getContainer()->get('templating')->render('content/blog/comment/form.html.twig', $data);
                $comment->childs = $this->renderComments($comments, $comment);
                $data['comment'] = $comment;
                $content .= '<li>'.$this->kernel->getContainer()->get('templating')->render('content/blog/comment/index.html.twig', $data).'</li>';
            }
        }

        if ($content !== '') {
            $content = '<ol>'.$content.'</ol>';
        }

        return $content;
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'dt_blog';
    }
}
