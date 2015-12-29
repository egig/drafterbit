<?php

namespace Drafterbit\Bundle\BlogBundle\Controller\Site;

use Doctrine\ORM\Query\Expr;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class FeedController extends Controller
{
	/**
	 * @Route("/feed.xml", name="dt_blog_feed")
	 */
	public function feedAction(Request $request)
    {
        $shows = $this->get('system')->get('blog.feed_shows', 10);

        $posts = $this->getDoctrine()->getManager()
            ->getRepository('BlogBundle:Post')
            ->createQueryBuilder('p')
            ->where("p.type = 'standard'")
            ->setMaxResults($shows)
            ->getQuery()
            ->getResult();

        $data['base_url'] = $request->getSchemeAndHttpHost().$request->getBaseurl();
        $data['posts'] = $this->formatFeeds($posts);

        $content =  $this->renderView('BlogBundle::feed.xml.twig', $data);

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