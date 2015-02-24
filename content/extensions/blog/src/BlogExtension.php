<?php namespace Drafterbit\Blog;

use Drafterbit\Framework\ExtensionEvent;
use Drafterbit\Framework\Application;

class BlogExtension extends \Drafterbit\Framework\Extension
{
    public function boot()
    {
        $this['helper']->register('blog', $this->getResourcesPath('helpers/blog.php'));
        $this['helper']->load('blog');

        $ns = $this->getNamespace();
        $extensionClass = $ns.'\\Extensions\\TwigExtension';

        // this must be after path.theme registered
        if (class_exists($extensionClass)) {
            $this['twig']->addExtension(new $extensionClass);
        }

        $this->addFrontPageOption(
            ['blog' => [
            'label' => 'Blog',
            'controller' => '@blog\Frontend::index',
            'defaults' => ['slug' => 'blog']
            ]
            ]
        );

        $system = $this->model('@system\System')->all();

        if ('blog' === $system['homepage']) {
            $urlPattern = '{yyyy}/{mm}/{slug}';
            $pageUrlPattern = 'page/{page}';
            $tagUrlPattern = 'tag/{slug}';
            $authorUrlPattern = 'author/{username}';
        } else {
            $urlPattern = 'blog/{yyyy}/{mm}/{slug}';
            $pageUrlPattern = 'blog/page/{page}';
            $tagUrlPattern = 'blog/tag/{slug}';
            $authorUrlPattern = 'blog/author/{username}';
        }
        
        $this['router']->addReplaces('%blog_url_pattern%', $urlPattern);
        $this['router']->addReplaces('%blog_tag_url_pattern%', $tagUrlPattern);
        $this['router']->addReplaces('%blog_author_url_pattern%', $authorUrlPattern);


        //log entities
        $this->addLogEntityFormatter(
            'post',
            function($id){
            
                $label = $this->model('Post')->getOneBy('id', $id)['title'];
                return '<a href="'.admin_url('blog/edit/'.$id).'">'.$label.'</a>';
            }
        );

        $this['widget']->register(new Widgets\TagsWidget);
    }

    public function getNav()
    {
        return [
            [ 'id' => 'blog', 'label' => 'Blog', 'href' => 'blog', 'parent' => 'content'],
            [ 'id' => 'comments', 'label' => 'Comments', 'href' => 'blog/comments', 'order' => 2],
            [ 'id' => 'blog-setting', 'label' => 'Blog', 'href' => 'blog/setting', 'parent' => 'setting']
        ];
    }

    public function getPermissions()
    {
        return [
            'post.view' => 'view post',
            'post.edit' => 'edit post',
            'post.save' => 'save a post',
            'post.delete' => 'delete or trash post',
            'post.revision.view' => 'view post revision',
            'comment.view' => 'view comment',
            'comment.delete' => 'delete comment',
        ];
    }

    public function getComments($id)
    {
        $model = $this->model('Comment');

        $comments = $model->getByPostId($id);

        return $comments;
    }

    function getSearchQuery()
    {
        $query = $this['db']->createQueryBuilder()
            ->select('*')
            ->from('#_posts', 'p')
            ->where("p.title like :q")
            ->orWhere("p.content like :q");

        return [$query, [
            'url' =>  function ($item) {
                    $date = date('Y/m', strtotime($item['created_at']));
                    return blog_url($date.'/'.$item['slug']);
            },
            'title' => function ($item) { return $item['title']; },
            'summary' => function ($item) { return $item['content']; }
        ]];
    }

    function getReservedBaseUrl()
    {
        return ['blog'];
    }

    public function getUrl($path)
    {
        $system = $this->model('@system\System')->all();

        if ('blog' !== $system['homepage']) {
            $path = "blog/".$path;
        }

        return base_url($path);
    }

    function dashboardWidgets()
    {
        return [
            'recent-comments' => (new Widgets\DashboardWidget)->recentComments()
        ];
    }

    function getStat()
    {
        $posts = $this->model('Post')->all(['status' => 'all']);
        $comments = $this->model('Comment')->all(['status' => 'all']);

        return [
            'Post(s)' => count($posts),
            'Comment(s)' => count($comments)
        ];
    }

    public function getShortcuts()
    {
        return [
            [
                'link' => admin_url('blog/edit/new'),
                'label' => 'New Post',
                'icon-class' => 'fa fa-edit'
            ]
        ];
    }
}
