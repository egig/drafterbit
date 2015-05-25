<?php namespace Drafterbit\Base\Controller;

use Drafterbit\Base\Controller;

class Frontend extends Controller
{
    /**
     * Helper method to render template
     *
     * @return string
     */
    function render($template, $data = [])
    {
        $theme = $this['input']->get('theme', $this['themes']->current());
        $nonce = $this['input']->get('nonce');

        $system = $this->model('@system\System')->all();
        $globals = [
            'siteName' =>  $system['site.name'],
            'siteDesc' => $system['site.description']
        ];

        $context = $this->model('@system\System')->get('theme.'.$theme.'.context');

        pathinfo($template, PATHINFO_EXTENSION)
            or $template .= '.html';

        if($theme and is_dir($path = $this['path.themes'].$theme.'/_tpl')) {
            if($nonce == csrf_token()) {
                $this['themes']->current($theme);
                
                // we need to check if site is not being customized
                // if yes we need to use temporary custom data
                if ($customData = $this['session']->get('customize_data')) {
                    $globals = array(
                        'siteName' => isset($customData['siteName']) ? $customData['siteName'] : $system['site.name'],
                        'siteDesc' => isset($customData['siteDesc']) ? $customData['siteDesc'] : $system['site.description']
                    );

                    if(isset($customData['theme.'.$theme.'.context'])) {
                        $context = $customData['theme.'.$theme.'.context'];
                    }
                }
            }
        } else {
            $path = $this['path.themes'].$this['themes']->current().'/_tpl';
        }

        $fileSystemLoader = new \Twig_Loader_Filesystem($path);
        $stringLoader = new \Twig_Loader_String;

        $loader = new \Twig_Loader_Chain([$fileSystemLoader, $stringLoader]);

        $this['twig']->setLoader($loader);

        $themeConfig = $this['themes']->get($theme);
        
        $options = [];
        if(isset($themeConfig['options'])) {
            foreach ($themeConfig['options'] as $option) {
                $options[$option['name']] = $option['default'];
            }
        }

        $globals = array_merge($globals, $options);

        $globals = array_merge($globals, json_decode($context, true) ?: []);

        foreach ($globals as $key => $value) {
            $this['twig']->addGlobal($key, $value);
        }

        return $this['twig']->render($template, $data);
    }
}
