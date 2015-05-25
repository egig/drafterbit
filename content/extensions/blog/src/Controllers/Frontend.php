<?php namespace Drafterbit\Blog\Controllers;

use Drafterbit\Base\Controller\Frontend as FrontendController;
use Symfony\Component\HttpFoundation\Response;

class Frontend extends FrontendController
{
    public function index()
    {
        $page = $this['input']->get('p', 1);

        $posts = $this->getFormattedPostList($page);

        $data['posts'] = $posts;

        $data = array_merge($data, $this->getNav($page));

        return $this->render('content/blog/index', $data);
    }

    public function view($yyyy = null, $mm = null, $slug = null)
    {
        $post = $this->model('@blog\Post')->getOneBy('slug', $slug) or show_404();

        $post['date'] = $this['time']->parse($post['created_at'])->format('d F Y');

        $post['tags'] = $this->model('@blog\Tag')->getByPost($post['id']);
        $post['categories'] = $this->model('@blog\Post')->getCategories($post['id']);

        $data['post'] = $post;
        return $this->render('content/blog/view', $data);
    }

    public function tag($slug)
    {
        $page = $this['input']->get('p', 1);
        $filter = ['tag' => $slug];

        $posts = $this->getFormattedPostList($page, $filter);

        $data['posts'] = $posts;
        $data = array_merge($data, $this->getNav($page, $filter));

        $tag = $this->model('Tag')->getSingleBy('slug', $slug);
        $data['tag'] = $tag;

        return $this->render('content/blog/tag/index', $data);
    }

    public function category($slug)
    {
        $page = $this['input']->get('p', 1);
        $filter = ['category' => $slug];

        $posts = $this->getFormattedPostList($page, $filter);

        $data['posts'] = $posts;
        $data = array_merge($data, $this->getNav($page, $filter));

        $category = $this->model('Category')->getOneBy('slug', $slug);
        $data['category'] = $category;

        return $this->render('content/blog/category/index', $data);
    }

    public function author($username)
    {
        $page = $this['input']->get('p', 1);
        $filter = ['username' => $username];

        $user = $this->model('@user\User')->getByUserName($username) or show_404();

        $posts = $this->getFormattedPostList($page, $filter);

        $data['posts'] = $posts;
        $data['user'] = $user;
        $data = array_merge($data, $this->getNav($page, $filter));

        return $this->render('content/blog/author/index', $data);
    }

    public function feed()
    {
        $system = $this->model('@system\System');
        $post = $this->model('@blog\Post');
        
        $data['siteName'] = $system->get('site.name');
        $data['siteDesc'] = $system->get('site.description');

        $shows = $system->get('feed.shows', 10);

        $data['posts'] = $this->formatFeeds($post->take($shows, 0));

        $content =  $this['template']->render('@blog/feed', $data);

        // Fixes short opentag issue
        $content = '<?xml version="1.0" encoding="UTF-8"?>'.$content;

        $response = new Response($content);
        $response->headers->set('Content-Type', 'application/xml');
        return $response;
    }

    private function formatFeeds($posts)
    {
        foreach ($posts as &$post) {
            $date = date('Y/m', strtotime($post['created_at']));

            $post['date'] = $this['time']->parse($post['updated_at'])->format('d F Y H:i:s');

            $post['url'] = blog_url($date.'/'.$post['slug']);

            
            if (strpos($post['content'], '<!--more-->') !== false) {
                $post['content'] = str_replace('<!--more-->', '', $post['content']);
            }

            $feedsContent = $this->model('@system\System')->get('feed.content', 1);

            $text = $post['content'];

            if($feedsContent == 2) {
                $post['feed_content'] = substr($text, 0, 250).( strlen($text) > 250 ? '&hellip;' : '');
            } else {
                $post['feed_content'] = $text;
            }
        }

        return $posts;
    }

    private function format($posts)
    {
        foreach ($posts as &$post) {
            $date = date('Y/m', strtotime($post['created_at']));

            $post['date'] = $this['time']->parse($post['created_at'])->format('d F Y');

            $post['url'] = blog_url($date.'/'.$post['slug']);

            $post['excerpt'] = false;
            
            if (strpos($post['content'], '<!--more-->') !== false) {
                $post['excerpt'] = current(explode('<!--more-->', $post['content'])).'&hellip;';
            }

            $post['tags'] = $this->model('@blog\Post')->getTags($post['id']);
            $post['categories'] = $this->model('@blog\Post')->getCategories($post['id']);
        }

        return $posts;
    }

    private function getPostList($page, $filter = [])
    {
        $perPage = $this->model('@system\System')->get('post.per_page', 5);
        
        $offset = ($page*$perPage)-$perPage;

        return $this->model('@blog\Post')->take($perPage, $offset, $filter);
    }

    private function getFormattedPostList($page, $filter = [])
    {
        $posts = $this->getPostList($page, $filter);

        return $this->format($posts);
    }

    private function hasNextPage($page, $filter = [])
    {
        return (boolean) count($this->getPostList($page+1, $filter));
    }

    private function getNav($page, $filter = [])
    {
        $data['prev_link'] = false;
        $data['next_link'] = false;

        if ($page > 1) {
            if($page == 2) {
                $data['prev_link'] = current_url();
            } else {
                $data['prev_link'] = current_url().'?p='.($page-1);
            }
        }

        if ($this->hasNextPage($page, $filter)) {
            $data['next_link'] = current_url().'?p='.($page+1);
        }

        return $data;
    }
}