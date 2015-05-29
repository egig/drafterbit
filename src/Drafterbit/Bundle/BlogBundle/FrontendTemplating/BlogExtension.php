<?php

namespace Drafterbit\Bundle\BlogBundle\FrontendTemplating;

use Symfony\Component\HttpKernel\Kernel;
use Drafterbit\Bundle\SystemBundle\Twig\Extension\FrontendExtension;
use Drafterbit\Bundle\BlogBundle\Entity\Post;

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

    public function comment(Post $post)
    {
        $comments = $post->getComments();
        $data['comments'] = $comments;

        $content = $this->renderComments($comments);

        $jsCommentSnippet = $this->kernel
            ->getBundle('DrafterbitBlogBundle')
            ->getPath().'/Resources/public/js/comment/front-snippet.js';

        $js = '<script>'.file_get_contents($jsCommentSnippet).'</script>';

        $form = $this->kernel->getContainer()->get('templating')->render('content/blog/comment/form.html', ['parent_id' => 0, 'post_id' => $post->getId()]);

        return $content.$form.$js;
    }

    public function blogUrl($path)
    {
        $path = trim($path, '/');

        $frontpage = $this->kernel->getContainer()->get('system')->get('frontpage');

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
                $data['parent_id'] = $comment->getId();
                $data['post_id'] = $comment->getPost()->getId();
                
                $comment->form = $this->kernel->getContainer()->get('templating')->render('content/blog/comment/form.html', $data);
                $comment->childs = $this->renderComments($comments, $comment);
                $data['comment'] = $comment;
                $content .= '<li>'.$this->kernel->getContainer()->get('templating')->render('content/blog/comment/index.html', $data).'</li>';
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
        return 'drafterbit_blog';
    }
}