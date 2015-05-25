<?php namespace Drafterbit\Blog;

use Drafterbit\Base\ExtensionEvent;
use Drafterbit\Base\Application;

class BlogExtension extends \Drafterbit\Base\Extension
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

        $home = $this->model('@system\System')->get('homepage');
        
        $patterns = [
            'post'   => '{yyyy}/{mm}/{slug}',
            'tag'    => 'tag/{slug}',
            'cat'    => 'category/{slug}',
            'author' => 'author/{username}'
        ];

        if ('blog' != $home) {
            array_walk($patterns, function(&$item, $key, $prefix){
                 $item = "$prefix/$item";
            }, 'blog');
        }
        
        $this['router']->addReplaces([
            '%blog_url%' => $patterns['post'],
            '%blog_tag_url%' => $patterns['tag'],
            '%blog_cat_url%' => $patterns['cat'],
            '%blog_author_url%' => $patterns['author']
        ]);

        //log entities
        $this['log.formatter']->addEntityFormatter(
            'post',
            function($id){

                $label = $this->model('Post')->getOneBy('id', $id)['title'];
                
                if($label) {
                    return '<a href="'.admin_url('posts/edit/'.$id).'">'.$label.'</a>';
                }

                return '<em>'.__('unsaved').'</em>';
            }
        );

        $this['widget']->register(new Widgets\TagsWidget);
    }

    public function getNav()
    {
        return [
            [ 'id' => 'blog', 'label' => 'Blog', 'order' => 1],
            [ 'id' => 'posts', 'label' => 'Posts', 'href' => 'posts', 'parent' => 'content', 'order' => 1, 'parent' => 'blog'],
            [ 'id' => 'categories', 'label' => 'Categories', 'href' => 'posts/categories', 'parent' => 'content', 'order' => 2, 'parent' => 'blog'],
            [ 'id' => 'comments', 'label' => 'Comments', 'href' => 'comments', 'order' => 3, 'parent' => 'blog'],
            [ 'id' => 'blog-setting', 'label' => 'Blog', 'href' => 'posts/setting', 'parent' => 'setting']
        ];
    }

    public function getPermissions()
    {
        return [ 'blog' =>[
            'post.view' => 'view post',
            'post.edit' => 'edit post',
            'post.save' => 'save a post',
            'post.delete' => 'delete or trash post',
            'post.revision.view' => 'view post revision',
            'comment.view' => 'view comment',
            'comment.delete' => 'delete comment',
        ]
        ];
    }

    public function getComments($id)
    {
        $model = $this->model('Comment');

        $comments = $model->getByPostId($id);

        return $comments;
    }

    public function getFrontpage()
    {
        return ['blog' => [
            'label' => 'Blog',
            'controller' => '@blog\Frontend::index',
            'defaults' => ['slug' => 'blog']
            ]
        ];
    }

    function getSearchQuery()
    {
        $query = $this['db']->createQueryBuilder()
            ->select('*')
            ->from('#_posts', 'p')
            ->where("p.title like :q")
            ->orWhere("p.content like :q")
            ->andWhere("p.type = 'standard'");

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

    function getDashboardWidgets()
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
                'link' => admin_url('posts/edit/new'),
                'label' => 'New Post',
                'icon-class' => 'fa fa-edit',
                'order' => 1
            ]
        ];
    }
}
