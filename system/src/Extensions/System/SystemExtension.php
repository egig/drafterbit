<?php namespace Drafterbit\Extensions\System;

use Drafterbit\Base\Application;

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
    }

    public function getNav()
    {
        return [
            ['id' => 'general', 'parent' => 'setting', 'label' => 'General', 'href' => 'setting/general', 'order' => 1],
            ['id' => 'themes', 'parent' => 'setting', 'label' => 'Themes', 'href' => 'setting/themes', 'order' => 2],

            ['id'=>'content', 'label' => 'Content', 'order' => 1],
            ['id'=>'menus',  'label' => 'Menus', 'order' => 2, 'href' => 'menus'],
            ['id'=>'users',   'label' => 'Users', 'order' => 3],
            ['id'=>'setting', 'label' => 'Setting'],
            ['id'=>'system',  'label' => 'System'],

            ['parent'=>'system', 'id'=> 'log',    'label' => 'Log',   'href' => 'system/log'],
            ['parent'=>'system', 'id'=> 'cache',  'label' => 'Cache', 'href' => 'system/cache'],

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
            'system.change' => 'change system setting',
            'appearance.change' => 'change appearance setting',
            'log.view' => 'view log',
            'log.delete' => 'delete log',
            'cache.view' => 'view cache',
            'cache.delete' => 'delete cache',
            'system.update' => 'update application'
        ];
    }

    public function getReservedBaseUrl()
    {
        return ['search'];
    }

    public function dashboardWidgets()
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