<?php namespace Drafterbit\Extensions\Pages\Controllers;

use Drafterbit\Extensions\System\FrontendController;

class Frontend extends FrontendController {

	public function index()
	{
		return $this->get('twig')->render('index.html');
	}

	public function home()
	{
		$id = $this->get('homepage.id');
		$page = $this->model('@pages\Pages')->getSingleBy('id', $id) or show_404();
		set('page', $page);
		// @todo: blank layout
		set('layout', 'layout/'.$page->layout);
		
		return $this->render('page/view.html', $this->data);
	}

	public function view($slug = null)
	{
		$page = $this->model('@pages\Pages')->getSingleBy('slug', $slug) or show_404();
		set('page', $page);
		set('layout', 'layout/'.$page->layout);
		
		return $this->render('page/view.html', $this->data);
	}
}