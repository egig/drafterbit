<?php namespace Drafterbit\Extensions\System;

use Drafterbit\Base\Application;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SystemExtension extends \Drafterbit\Base\Extension
{
    public function boot()
    {
        foreach (['form', 'support'] as $helper) {
            $this['helper']->register($helper, $this->getResourcesPath("helpers/$helper.php"));
            $this['helper']->load($helper);
        }

        $this['widget']->register(new Widgets\SearchWidget);
        $this['widget']->register(new Widgets\TextWidget);
        $this['widget']->register(new Widgets\MenuWidget);
        $this['widget']->register(new Widgets\MetaWidget);

        $this['router']->addReplaces('%admin%', $this['config']['path.admin']);

        // frontpage routes
        $frontpage = $this['extension']->data('frontpage');
        $system = $this['extension']->get('system')->model('@system\System')->all();
        $homepage = $system['homepage'];
        $route = $frontpage[$homepage];

        $this['router']->addRouteArray([
            '/' => [
                'controller' => $route['controller'],
                'defaults' => $route['defaults']
            ]
        ]);

        // pages
        $reservedBaseUrl = implode('|', $this['extension']->data('reserved_base_url'));                

        $this['router']->addRouteArray([
            '/{slug}' =>
            [
            'controller' => '@pages\Frontend::view',
            'requirements' => [
            // @prototype  'slug' => "^(?!(?:backend|blog)(?:/|$)).*$"
            'slug' => "^(?!(?:%admin%|".$reservedBaseUrl."|)(?:/|$)).*$"
            ]
            ]
        ]);

        if (! $this['debug']) {
            $this['exception']->error(
                function(NotFoundHttpException $e){
                
                    if (is_file($this['path.theme'].'_tpl/404.html')) {
                        $this['twig']->setLoader(new \Twig_Loader_Filesystem($this['path.theme'].'_tpl'));
                        $content =  $this['twig']->render('404.html');
                    } else {
                        $content = file_get_contents($this->getResourcesPath('views/404.html'));
                    }

                    return new Response($content, '404');
                }
            );
        }
    }

    public function getNav()
    {
        return [
            ['id' => 'general', 'parent' => 'setting', 'label' => 'General', 'href' => 'setting/general'],
            ['id' => 'themes', 'parent' => 'setting', 'label' => 'Themes', 'href' => 'setting/themes'],

            ['id'=>'menus',  'label' => 'Menus', 'href' => 'menus', 'order' => 5],
            ['id'=>'setting', 'label' => 'Setting', 'order' => 6],
            ['id'=>'system',  'label' => 'System', 'order' => 7],

            ['parent'=>'system', 'id'=> 'log',    'label' => 'Log',   'href' => 'system/log'],
            ['parent'=>'system', 'id'=> 'cache',  'label' => 'Cache', 'href' => 'system/cache'],
            ['parent'=>'system', 'id'=> 'update',  'label' => 'Update', 'href' => 'system/update'],

            // help coming soon
            // ['id'=>'help', 'label' => 'Help'],
            // ['id'=>'doc.wiki', 'parent'=>'help', 'label' => 'Documentation Wiki', 'href' => '#', 'class'=> 'soon'],
            // ['id'=>'community', 'parent'=>'help', 'label' => 'Community Forum', 'href' => '#', 'class'=> 'soon'],
            // ['id'=>'support', 'parent'=>'help', 'label' => 'Official Support', 'href' => '#', 'class'=> 'soon']
        ];
    }

    public function getPermissions()
    {
        return [
        'system' => [
            'system.change' => 'change system setting',
            'appearance.change' => 'change appearance setting',
            'log.view' => 'view log',
            'log.delete' => 'delete log',
            'cache.view' => 'view cache',
            'cache.delete' => 'delete cache',
            'system.update' => 'update application'
        ]
        ];
    }

    public function getReservedBaseUrl()
    {
        return ['search'];
    }

    public function getDashboardWidgets()
    {
        $dashboard = new Widgets\DashboardWidget;

        return [
            'shortcuts' => $dashboard->shortcuts(),
            'recent' => $dashboard->recent(),
            'stat' => $dashboard->info(),
        ];
    }

    public function getShortcuts()
    {
        $theme = $this['themes']->current();

        return [
            [
                'link' => admin_url('setting/themes/customize?theme='.$theme.'&csrf='.csrf_token()),
                'label' => 'Appearance',
                'icon-class' => 'fa fa-desktop',
                'window' => '_blank',
                'order' => 4
            ]
        ];
    }
}