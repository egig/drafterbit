<?php namespace Drafterbit\Extensions\System;

use Drafterbit\Base\Controller;

class FrontendController extends Controller
{
    /**
     * Helper method to render template
     *
     * @return string
     */
    function render($template, $data = [])
    {
        pathinfo($template, PATHINFO_EXTENSION)
            or $template .= '.html';

        $theme = $this['input']->get('theme');
        $nonce = $this['input']->get('nonce');

        if($theme and is_dir($path = $this['path.themes'].$theme.'/_tpl')) {
            if($nonce == csrf_token()) {
                $this['themes']->current($theme);
            }
        } else {
            $path = $this['path.themes'].$this['themes']->current().'/_tpl';
        }

        $fileSystemLoader = new \Twig_Loader_Filesystem($path);
        $stringLoader = new \Twig_Loader_String;

        $loader = new \Twig_Loader_Chain([$fileSystemLoader, $stringLoader]);

        $this['twig']->setLoader($loader);

        // we need to check if site is not being customized
        // if yes we need to use temporary custom data
        $system = $this->model('@system\System')->all();
        
        /*if ($this['session']->get('customize_mode')) {
            $customizingBadge = '<div style="color:#9C6D3B;padding:5px;background:#FCF8E3;z-index:9999;">Customize Mode is On</div>';

            $customData = $this['session']->get('customize_data');
            $globals = array(
                'siteName' => isset($customData['siteName']) ? $customData['siteName'] : $system['site.name'],
                'siteDesc' => isset($customData['siteDesc']) ? $customData['siteDesc'] : $system['site.description']
            );

        } else {*/
            $customizingBadge = '';
            $globals = [
                'siteName' =>  $system['site.name'],
                'siteDesc' => $system['site.description']
            ];
        //}

        $theme = $this['themes']->current();


        $themeConfig = $this['themes']->get($theme);
        
        $options = [];
        if(isset($themeConfig['options'])) {
            foreach ($themeConfig['options'] as $option) {
                $options[$option['name']] = $option['default'];
            }
        }

        $globals = array_merge($globals, $options);

        $context = $this->model('@system\System')->get('theme.'.$theme.'.context');

        $globals = array_merge($globals, json_decode($context, true) ?: []);

        foreach ($globals as $key => $value) {
            $this['twig']->addGlobal($key, $value);
        }

        return $customizingBadge.$this['twig']->render($template, $data);
    }
}
