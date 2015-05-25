<?php namespace Drafterbit\Blog\Widgets;

use Drafterbit\Base\Dashboard as Base;

class DashboardWidget extends Base
{

    public function recentComments()
    {
        $data['comments'] = $this['extension']
            ->get('blog')
            ->model('Comment')->take(5);
        return $this['template']->render('@blog/dashboard/recent-comments', $data);
    }
}