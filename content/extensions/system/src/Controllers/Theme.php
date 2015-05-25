<?php namespace Drafterbit\Extensions\System\Controllers;

use Drafterbit\Base\Controller\Backend as BackendController;

class Theme extends BackendController
{
    public function index()
    {
        $this->setting = $this->model('@system\System');

        $cache = $this['cache'];
        $post = $this['input']->post();

        if ($post) {
            $this->setting->updateTheme($post['theme']);

            // show notif
            $this['template']->addGlobal('messages', [['text' => "Theme updated", "type" => 'success']]);
        }

        $settings = $this->setting->all();

        $data['currentTheme'] = $this->model('System')->get('theme');

        $themesDir = $this['path.themes'];
        $themes = $this['themes']->all();

        $data['themes'] = $themes;
        $data['id'] = 'themes';
        $data['title'] = __('Themes');

        return $this->render('@system/setting/themes', $data);
    }

    public function customize()
    {
        $this['session']->remove('customize_data');


        $theme = $this['input']->get('theme');

        $context = $this->model('System')->get('theme.'.$theme.'.context');
        
        if($context) {
            $context = json_decode($context, true);
        }

        $currentTheme = $this['themes']->get($theme);
        
        $optionInputs = [];
        if(isset($currentTheme['options'])) {
            
            foreach ($currentTheme['options'] as $option) {
            
                if(isset($context[$option['name']])) {
                    $value = $context[$option['name']];
                } else {
                    $value = isset($option['default']) ? $option['default'] : null;
                }

                $optionInputs[] = $this->createOptionInput($option, $value);
            }
        }

        $positions = $currentTheme['widgets'];

        $availableWidget = $this['widget']->all();
        
        foreach ($availableWidget as &$widget) {
            $widget->ui = $this['widget.ui']->build($widget);
        }

        $model = $this->model('widget');
        foreach ($positions as $position) {

            // get current widget
            $widgets[$position] = $model->widget($position, $theme);

            usort(
                $widgets[$position],
                function($a, $b) {
                    if ($a['sequence'] == $b['sequence']) {
                        return $a['id'] - $b['id'];
                    }

                    return $a['sequence'] < $b['sequence'] ? -1 : 1;
                }
            );
        }

        foreach ($widgets as $name => &$arrayOfWidget) {
            foreach ($arrayOfWidget as &$widget) {

                $context = $widget['context'];
                $context['id'] = $widget['id'];
                $context['title'] = $widget['title'];

                $widgetObj = $this['widget']->get($widget['name']);
                $widgetObj->setContext($context);
                
                $widget['ui'] = $this['widget.ui']->build($widgetObj);
            }
        }

        $menuPositions = $currentTheme['menus'];

        $menuModel = $this->model('@system\\Menus');

        $config = $this->model('@system\System')->all();
        
        $pageOptions = [];
        foreach($this['extension']->data('frontpage') as $id => $param) {
            $pageOptions[$id] = $param['label'];
        }

        $data = [
            'siteName' => $config['site.name'],
            'tagLine' => $config['site.description'],
            'homepage' => $config['homepage'],
            'pageOptions' => $pageOptions,
        ];

        $menus = $this->model('System')->get('theme.'.$theme.'.menus');

        if($menus) {
            $menus = json_decode($menus, true);
        }

        $data['availableWidget'] = $availableWidget;
        $data['menuPositions'] = $menuPositions;
        $data['widgetPositions'] = $positions;
        $data['widgets'] = $widgets;
        $data['menus'] = $menus;
        $data['context'] = $context;
        $data['menuOptions'] =$this->model('Menus')->all();
        $data['theme'] = $theme;
        $data['preview_url'] = base_url('?theme='.$theme.'&nonce='.csrf_token());
        $data['optionInputs'] = $optionInputs;

        return $this->render('@system/setting/customize', $data);
    }

    public function customPreview()
    {
        // end session if preview window id closed
        if ($this['input']->post('endSession')) {
            $this['session']->remove('customize_data');
            return;
        }

        $context = $this['input']->post('context');
        $general = $this['input']->post('general');

        $theme = $this['input']->post('theme');
        if($menus = $this['input']->post('menus')) {
            $menus = json_encode($menus);
        }

        if ($this['input']->post('action') == 'save') {

            // @todo create twig cache after update setting
            $this->model('@system\System')->updateSetting(
                [
                'site.name' => $general['title'],
                'site.description' => $general['tagline'],
                'theme.'.$theme.'.menus' => $menus,
                'theme.'.$theme.'.context' => json_encode($context),
                ]
            );
        }

        $c_data = [
            'siteName' => $general['title'],
            'siteDesc' => $general['tagline'],
            'theme.'.$theme.'.context' => json_encode($context)
        ];

        $this['session']->set('customize_data', $c_data);

        $url = $this['input']->post('url');

        return $this->jsonResponse(
            [
                'message' => __('Theme Saved'),
                'status' => 'success',
                'url' => $url,
            ]
        );
    }

    private function createOptionInput($option, $value)
    {
        $name = "context[{$option['name']}]";

        switch ($option['type']) {
            case 'string':
                return '<label class="control-label">'.$option['label'].'</label>
                <input class="form-control input-sm" type="string" name="'.$name.'" value="'.value($option['name'], $value).'">';
                break;
            case 'color':
                return '<label class="control-label">'.$option['label'].'</label>
                <input class="form-control input-sm dt-color-picker" type="string" name="'.$name.'" value="'.value($option['name'], $value).'">';
                break;
            case 'boolean':
                $checked = $value ? 'checked' : '';
                return '<div class="checkbox"> <label> <input name="'.$name.'" value="1" type="checkbox" '.$checked.'> '.$option['label'].' </label></div>';
                break;
            case 'image' :
                return '<label class="control-label">'.$option['label'].'</label>
                <input id="input-'.$option['name'].'" type="hidden" name="'.$name.'" value="'.value($option['name'], $value).'">
                <div class="well well-sm"><img style="width:100%" id="'.$option['name'].'" alt="No Image" src="'.$value.'" /></div>
                <a href="javascript:;" data-fallback="'.$option['name'].'" class="btn btn-default btn-xs dt-image-add">'.__('Select image').'</a>
                <a href="javascript:;" data-fallback="'.$option['name'].'" class="btn btn-xs dt-image-remove">'.__('Remove image').'</a>';
                break;
            default:
                return '<div><em>Unsupported option type: '.$option['type'].'</em></div>';
                break;
        }
    }
}