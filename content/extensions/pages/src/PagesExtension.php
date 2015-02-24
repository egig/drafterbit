<?php namespace Drafterbit\Extensions\Pages;

class PagesExtension extends \Drafterbit\Framework\Extension
{

    public function boot()
    {
        //log entities
        $this->addLogEntityFormatter(
            'page',
            function($id){
            
                $label = $this->model('@pages\Pages')->getSingleBy('id', $id)['title'];
                return '<a href="'.admin_url('pages/edit/'.$id).'">'.$label.'</a>';
            }
        );
    }

    public function getNav()
    {
        return [
            [ 'id'=>'pages', 'parent' =>'content', 'label' => 'Pages', 'href' => 'pages', 'order' => 1],
        ];
    }

    public function getPermissions()
    {
        return [
            'page.view' => 'view page',
            'page.add' => 'add page',
            'page.edit' => 'edit page',
            'page.delete' => 'delete page',
        ];
    }

    function getSearchQuery()
    {
        $query = $this['db']->createQueryBuilder()
            ->select('*')
            ->from('#_pages', 'p')
            ->where("p.title like :q")
            ->orWhere("p.content like :q");

        return [$query, [
            'url' =>  function ($item) { return base_url($item['slug']); },
            'title' => function ($item) { return $item['title']; },
            'summary' => function ($item) { return $item['content']; }
        ]];
    }

    function getStat()
    {
        $pages = $this->model('Pages')->all(['status' => 'untrashed']);

        return [
            'Page(s)' => count($pages)
        ];
    }

    public function getShortcuts()
    {
        return [
            [
                'link' => admin_url('pages/edit/new'),
                'label' => 'New Page',
                'icon-class' => 'fa fa-file-o'
            ]
        ];
    }
}
