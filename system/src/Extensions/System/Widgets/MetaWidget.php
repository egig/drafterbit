<?php namespace Drafterbit\Extensions\System\Widgets;

use Drafterbit\App\Widget\Widget;

class MetaWidget extends Widget
{
	public function getName()
	{
		return 'meta';
	}

    public function run($context = null)
    {
        $links = [];
        if($this->getExtension('user')->model('Auth')->isLoggedIn()) {
            $links['Admin Panel'] = admin_url();
            $links['Log Out'] = admin_url('logout');
        } else {
            $links['Log In'] = admin_url('login');
        }

        $links['Posts RSS'] = blog_url('feed.xml');
        $links['Drafterbit.org'] =   'http://drafterbit.org';

        $items = [];
        foreach ($links as $label => $link) {
            $item['link'] = $link;
            $item['label'] = $label;

            $items[] = $item;
        }

        $data['items'] = $items;
        return $this['twig']->render('widgets/meta.html', $data);
    }
}