<?php namespace Drafterbit\Extensions\Pages\Controllers;

use Drafterbit\Extensions\System\FrontendController;

class Frontend extends FrontendController
{
    public function home($id = null)
    {
        $system = $this->model('@system\System')->all();
        $_temp = explode(':', $system['homepage']);
        $id = end($_temp);

        $page = $this->model('@pages\Pages')->getSingleBy('id', $id) or show_404();
        
        $data['page'] = $page;

        // @todo: blank layout
        return $this->render('page/view', $data);
    }

    public function view($slug = null, $_format = 'html')
    {
        $page = $this->model('@pages\Pages')->getSingleBy('slug', $slug) or show_404();

        $page['layout'] = 'layout/'.$page['layout'];
        $data['page'] = $page;
        return $this->render('content/page/view', $data);
    }
}
