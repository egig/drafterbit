<?php namespace Drafterbit\Blog\Widgets;

use Drafterbit\App\Widget\Widget;

class TagsWidget extends Widget
{
	public function getName()
	{
		return 'tags';
	}

    public function run($context = null)
    {
        $model = $this->model('Tag');

        $num = isset($context['num']) ? $context['num'] : ''; 
        $orderBy = isset($context['order_by']) ? $context['order_by'] : 'alpha'; 
        $tags = $model->getForWidget($num, $orderBy);

        $tags = array_map(function($tag) {
            $tag['url'] = base_url('tag/'.$tag['slug']);
            return $tag;
        }, $tags);

        $data['tags'] = $tags;
        return $this['twig']->render('widgets/tags.html', $data);
    }

    public function getContextTypes()
    {
        return [
            [
             'name' =>'order_by',
             'label' => 'Order by',
             'type' => 'radio',
             'default' => 'alpha',
             'options' => ['alpha' => 'Alphabetic', 'most-used' => 'Most Used'],
            ],
            [
             'name' => 'num',
             'label' => 'Display',
             'type' => 'number',
             'default' => '',
             'help' => 'Leave it blank to display all tags'
            ]
        ];
    }
}