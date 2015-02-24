<?php namespace Drafterbit\Blog\Widgets;

use Drafterbit\System\Widget\Widget;

class TagsWidget extends Widget
{
	public function getName()
	{
		return 'tags';
	}

    public function run($context = null)
    {
        $model = $this->model('Tag');
        $tags =$model->all();

        $tags = array_map(function($tag) {
            $tag['url'] = base_url('tag/'.$tag['slug']);
            return $tag;
        }, $tags);

        $data['tags'] = $tags;
        return $this['twig']->render('widgets/tags.html', $data);
    }
}