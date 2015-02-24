<?php namespace Drafterbit\Blog\Widgets;

use Drafterbit\System\DashboardWidget as Base;

class DashboardWidget extends Base
{

    public function recentComments()
    {
        $data['comments'] = $this['app']
        	->getExtension('blog')
        	->model('Comment')->take(5);
        return $this['template']->render('@blog/dashboard/recent-comments', $data);
    }
}