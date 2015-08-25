<?php

namespace Drafterbit\Bundle\BlogBundle\Twig\Extension;

use Symfony\Component\HttpKernel\Kernel;
use Drafterbit\Bundle\SystemBundle\Twig\Extension\FrontendExtension;
use Drafterbit\Bundle\BlogBundle\Entity\Post;
use Drafterbit\Bundle\BlogBundle\Form\Type\CommentType;
use Drafterbit\Bundle\BlogBundle\Entity\Comment;

class BlogExtension extends \Twig_Extension
{
    protected $kernel;

    public function __construct(Kernel $kernel)
    {
        $this->kernel = $kernel;
    }

    public function getFunctions()
    {
        return array(
            new \Twig_SimpleFunction('blog_url', array($this, 'blogUrl')),
            new \Twig_SimpleFunction('comment', array($this, 'comment'))
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

        $form = $this->kernel->getContainer()->get('form.factory')->create(new CommentType);
        $form->get('post')->setData($post);


        $formSection = $this->kernel->getContainer()->get('templating')->render('content/blog/comment/form.html.twig',
            [
                'form' =>  $form->createView(),
                'parent' => null,
                'form_id' => 'form-comment-0'
            ]);

        return $content.$formSection.$js;
    }

    public function blogUrl($path)
    {
        $path = trim($path, '/');

        $frontpage = $this->kernel->getContainer()->get('system')->get('system.frontpage');

        if($frontpage != 'blog') {
            $path = 'blog/'.$path;
        }

        return (new FrontendExtension($this->kernel))->baseUrl($path);
    }

    /**
     * Render comments reqursively
     */
    private function renderComments($comments, $parent = null)
    {
        $content ='';
        foreach ($comments as $comment) {

            if($comment->getParent() == $parent) {

                $newComment =  new Comment;
                $newComment->setParent($comment);
                $form = $this->kernel->getContainer()->get('form.factory')->create(new CommentType, $newComment);
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

        if($content !== '') {
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
