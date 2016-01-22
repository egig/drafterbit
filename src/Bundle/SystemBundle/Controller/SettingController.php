<?php

namespace Drafterbit\Bundle\SystemBundle\Controller;

use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\Security\Core\Exception\InvalidCsrfTokenException;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

use Drafterbit\Bundle\SystemBundle\Form\Type\SystemType;
use Drafterbit\Bundle\SystemBundle\Entity\Widget;
use Drafterbit\Bundle\SystemBundle\Form\Type\WidgetType;


class SettingController extends Controller
{
    /**
     * @Template()
     * @Security("is_granted('ROLE_SETTING_GENERAL_MANAGE')")
     * @todo Setting validation rules
     */
    public function generalAction(Request $request)
    {
        $fields = $this->get('dt_system.setting.field_manager')->getAll();

        $settingFormBuilder = $this->get('form.factory')->createNamedBuilder('setting');

        $settingFormBuilder->add('Save', SubmitType::class);

        foreach ($fields as $name => $field) {
            $name = $field->getName();
            $type = $field->getFormType();
            $settingFormBuilder->add($name, $type);
        }

        $mainForm = $settingFormBuilder->getForm();

        //Move general to be first
        $fields = ['system' => $fields['system']]+$fields;

        $notif['message'] = false;

        if($request->isXmlHttpRequest()) {

            $mainForm->handleRequest($request);

            if($mainForm->isValid()) {

                $setting = $request->request->get('setting');

                $setting = static::dot($setting);

                unset($setting['Save']);
                unset($setting['_token']);

                $this->get('system')->update($setting);

                $response = ['message' => $this->get('translator')->trans('Setting Saved'), 'status' => 'success'];
                return new JsonResponse($response);
            }
        }

        $data = [
            'page_title' => $this->get('translator')->trans('Setting'),
            'view_id' => 'setting',
            'action' => $this->generateUrl('dt_system_setting_general'),
            'form' => $mainForm->createView(),
            'fields' => $fields
        ];

        return array_merge($data, $notif);
    }

    /**
     * @Route("/setting/theme", name="dt_system_setting_theme")
     * @Template()
     * @Security("is_granted('ROLE_SETTING_THEME_MANAGE')")
     */
    public function themeAction()
    {
        $themes = $this->getThemes();
        return [
            'page_title' => $this->get('translator')->trans('Theme'),
            'themes' => $themes
        ];
    }

    private function getThemes()
    {
        $themes_path = $this->container->getParameter('themes_path');

        $themes = [];
        $dirs = (new Finder)->in($themes_path)->directories()->depth(0);

        foreach ($dirs as $dir) {
            if(file_exists($config = $dir->getRealpath().'/theme.json')) {
                $theme = json_decode(file_get_contents($config), true);

                $theme['is_active'] = ($theme['id'] == $this->container->getParameter('theme'));

                $ssImage = null;
                if(isset($theme['screenshot'])) {
                    $ssImage = $dir->getRealpath().DIRECTORY_SEPARATOR.$theme['screenshot'];
                }

                if(!file_exists($ssImage)) {
                    $ssImage = $this->get('kernel')->getBundle('SystemBundle')->getPath().'/Resources/screenshot.jpg';
                }

                // @todo create default base64 image
                $theme['screenshot_base64'] = $this->encodeImage($ssImage);

                $themes[] = $theme;
            }
        }

        return $themes;
    }

    /**
     * Base64 encode theme screenshot image.
     *
     * @param $imagePath string
     **/
    private function encodeImage ($imagePath) {

        $extension = pathinfo($imagePath, PATHINFO_EXTENSION);

            $imgBinary = fread(fopen($imagePath, "r"), filesize($imagePath));
            return 'data:image/' . $extension . ';base64,' . base64_encode($imgBinary);
    }

    /**
     * @Route("/setting/theme/customize", name="dt_setting_theme_customize")
     * @Template()
     */
    public function customizerAction(Request $request)
    {
        // safety first
        $token = $request->query->get('_token');
        if(!$this->isCsrfTokenValid('customize_theme', $token)) {
            throw new InvalidCsrfTokenException();
        };

        $theme = $request->query->get('theme');

        $themesPath = $this->container->getParameter('themes_path');

        $themeConfig = json_decode(file_get_contents($themesPath.'/'.$theme.'/theme.json'), true);

        $availableMenus = [];

        $em = $this->getDoctrine()->getManager();

        $availableMenus[0] = '-- Select Menu --';
        $menus = $em->getRepository('SystemBundle:Menu')->findAll();
        foreach ($menus as $menu) {
            $availableMenus[$menu->getId()] = $menu->getDisplayText();
        }

        $context = $this->get('system')->get('theme.'.$theme.'.context', '');
        $themeMenus = $this->get('system')->get('theme.'.$theme.'.menu', '');
        $themeMenuIds = json_decode($themeMenus, true);

        $context = json_decode($context, true);

        $optionInputs = [];
        if(isset($themeConfig['option'])) {

            foreach ($themeConfig['option'] as $option) {

                if(isset($context[$option['name']])) {
                    $value = $context[$option['name']];
                } else {
                    $value = isset($option['default']) ? $option['default'] : null;
                }

                $optionInputs[] = $this->createOptionInput($option, $value);
            }
        }

        $availableWidgets = $this->get('dt_system.widget.manager')->all();
        foreach ($availableWidgets as &$widget) {
            $newWidget = new Widget;
            $newWidget->setTheme($theme);
            $newWidget->setName($widget->getName());
            $form = $this->get('dt_system.widget.form_builder')->build($widget, $newWidget);
            $widget->form = base64_encode($form);
        }

        // @todo validate theme config
        $positions = isset($themeConfig['widget'])? $themeConfig['widget'] : [];

        $widgets = [];
        foreach ($positions as $position) {

            // get current widget
            $widgets[$position] = $em->getRepository('SystemBundle:Widget')
                ->getByThemePosition($position, $theme);

            usort(
                $widgets[$position],
                function($a, $b) {
                    if ($a->getSequence() == $b->getSequence()) {
                        return $a->getId() - $b->getId();
                    }

                    return $a->getSequence() < $b->getSequence() ? -1 : 1;
                }
            );
        }

        foreach ($widgets as $name => &$arrayOfWidget) {
            foreach ($arrayOfWidget as &$w) {

                $context = json_decode($w->getContext(), true);

                $widgetObj = $this->get('dt_system.widget.manager')->get($w->getName());
                $widgetObj->setContext($context);

                $w->form = $this->get('dt_system.widget.form_builder')->build($widgetObj, $w);
            }
        }

        return [
            'theme' => $theme,
            'page_title' => $this->get('translator')->trans('Theme Customizer'),
            'available_widget' => $availableWidgets,
            'widgets' => $widgets,
            'option_inputs' => $optionInputs,
            'menu_positions' => (isset($themeConfig['menu']) ? $themeConfig['menu']: []),
            'widget_positions' => $positions,
            'menu_options' => $availableMenus,
            'theme_menu_ids' => $themeMenuIds,
        ];
    }

    /**
     * @todo clean this
     */
    private function createOptionInput($option, $value)
    {
        $name = "context[{$option['name']}]";

        switch ($option['type']) {
            case 'string':
                return '<label class="control-label">'.$option['label'].'</label>
                <input class="form-control input-sm" type="string" name="'.$name.'" value="'.$value.'">';
                break;
            case 'color':
                return '<label class="control-label">'.$option['label'].'</label>
                <input class="form-control input-sm dt-color-picker" type="string" name="'.$name.'" value="'.$value.'">';
                break;
            case 'boolean':
                $checked = $value ? 'checked' : '';
                return '<div class="checkbox"> <label> <input name="'.$name.'" value="1" type="checkbox" '.$checked.'> '.$option['label'].' </label></div>';
                break;
            case 'image' :
                return '<label class="control-label">'.$option['label'].'</label>
                <input id="input-'.$option['name'].'" type="hidden" name="'.$name.'" value="'.$value    .'">
                <div class="well well-sm"><img style="width:100%" id="'.$option['name'].'" alt="No Image" src="'.$value.'" /></div>
                <a href="javascript:;" data-fallback="'.$option['name'].'" class="btn btn-default btn-xs dt-image-add">'.$this->trans('Select image').'</a>
                <a href="javascript:;" data-fallback="'.$option['name'].'" class="btn btn-xs dt-image-remove">'.$this->trans('Remove image').'</a>';
                break;
            default:
                return '<div><em>Unsupported option type: '.$option['type'].'</em></div>';
                break;
        }
    }

    public function trans($string, $param = [])
    {
        return $this->get('translator')->trans($string, $param);
    }

    public function themeSaveAction(Request $request)
    {
        $context = $request->request->get('context');
        $general = $request->request->get('general');

        $theme = $request->request->get('theme');
        if($menus = $request->request->get('menus')) {
            $menus = json_encode($menus);
        }

        if ($request->request->get('action') == 'save') {

            $this->container->get('system')->update(
                [
                'sitename' => $general['title'],
                'tagline'=> $general['tagline'],
                'theme.'.$theme.'.menu' => $menus,
                'theme.'.$theme.'.context' => json_encode($context),
                ]
            );
        }

        // @todo
        // $c_data = [
        //    'siteName' => $general['title'],
        //    'siteDesc' => $general['tagline'],
        //   'theme.'.$theme.'.context' => json_encode($context)
        // ];
        // $this['session']->set('customize_data', $c_data);

        $url = $request->request->get('url');

        return new JsonResponse(
            [
                'message' => $this->trans('Theme Saved'),
                'status' => 'success',
                'url' => $url,
            ]
        );
    }

    /**
     * Flatten a multi-dimensional associative array with dots.
     *
     * @param  array   $array
     * @param  string  $prepend
     * @return array
     */
    public static function dot($array, $prepend = '')
    {
        $results = [];

        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $results = array_merge($results, static::dot($value, $prepend.$key.'.'));
            } else {
                $results[$prepend.$key] = $value;
            }
        }

        return $results;
    }
}
