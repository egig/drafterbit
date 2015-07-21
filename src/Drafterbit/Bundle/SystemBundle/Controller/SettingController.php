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

use Drafterbit\Bundle\SystemBundle\Form\Type\SystemType;
use Drafterbit\Bundle\SystemBundle\Entity\Widget;
use Drafterbit\Bundle\SystemBundle\Form\Type\WidgetType;

/**
 * @Route("/%admin%")
 */
class SettingController extends Controller
{
    /**
     * @Route("/setting/general", name="drafterbit_system_setting_general")
     * @Template()
     * @Security("is_granted('ROLE_SETTING_GENERAL_MANAGE')")
     */
    public function generalAction(Request $request)
    {
        $fields = $this->get('drafterbit_system.setting.field_manager')->getAll();

        $mainForm = $this->get('form.factory')->createNamedBuilder('setting')
            ->add('Save', 'submit')
            ->getForm();

        $fieldNames = [];
        foreach ($fields as $name => $form) {
            $fieldNames[] = $form->getConfig()->getName();
            $form->getConfig()->setAutoInitialize(false);
            $mainForm->add($form);
        }

        unset($fieldNames[array_search('system', $fieldNames)]);
        array_unshift($fieldNames, 'system');

        $notif['message'] = false;

        if($request->isXmlHttpRequest()) {

            $mainForm->handleRequest($request);

            if($form->isValid()) {

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
            'action' => $this->generateUrl('drafterbit_system_setting_general'),
            'form' => $mainForm->createView(),
            'field_names' => $fieldNames
        ];

        return array_merge($data, $notif);
    }

    /**
     * @Route("/setting/theme", name="drafterbit_system_setting_theme")
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

    /**
     * @Route("/setting/widget/delete", name="drafterbit_setting_widget_delete")
     */
    public function widgetDeleteAction(Request $request)
    {
        $id = $request->request->get('id');
        $em = $this->getDoctrine()->getManager();
        $widget = $em->getRepository('DrafterbitSystemBundle:Widget')
            ->find($id);
        $em->remove($widget);
        $em->flush();

        return new Response();
    }

    /**
     * @Route("/setting/widget/save", name="drafterbit_setting_widget_save")
     */
    public function widgetSaveAction(Request $request)
    {
        $position = $request->request->get('position');
        $widgetRequested = $request->request->get('widget');

        $id = $widgetRequested['id'];

        $em = $this->getDoctrine()->getManager();
        $widget = $em->getRepository('DrafterbitSystemBundle:Widget')
            ->find($id);

        if(!$widget) {
            $sequence = 0;
            $widget = new Widget;
        } else {
            $sequence = $widget->getSequence();
        }

        $form = $this->createForm(new WidgetType, $widget);
        $form->handleRequest($request);

        if($form->isValid()) {
            $widget = $form->getData();
            $widget->setPosition($position);
            $widget->setSequence($sequence);

            $context = json_encode($widgetRequested);

            $widget->setContext($context);

            $em->persist($widget);
            $em->flush();

            return new JsonResponse(['message' => 'Widget saved', 'status' => 'success', 'id' =>  $widget->getId()]);
        } else {
            return new Response($form->getErrorsAsString());
        }

        // @todo return error
    }

    /**
     * @Route("/setting/widget/sort", name="drafterbit_setting_widget_sort")
     */
    public function widgetSortAction(Request $request)
    {
        $ids = $request->request->get('order');
        $em = $this->getDoctrine()->getManager();

        $order = 1;
        foreach (array_filter(explode(',', $ids)) as $temp) {
            $temp2 = explode('-', $temp);
            $id = current($temp2);
            //$data = ['sequence' => $order];

            $widget = $em->getRepository('DrafterbitSystemBundle:Widget')->find($id);

            $widget->setSequence($order);
            $em->persist($widget);
            $em->flush();

            $order++;
        }

        return new Response(1);
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
                $themes[] = $theme;
            }
        }

        return $themes;
    }

    /**
     * @Route("/setting/theme/customize", name="drafterbit_setting_theme_customize")
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

        $menus = $em->getRepository('DrafterbitSystemBundle:Menu')->findAll();
        foreach ($menus as $menu) {
            $availableMenus[$menu->getId()] = $menu->getDisplayText();
        }

        $context = $this->get('system')->get('theme.'.$theme.'.context', '');

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

        $availableWidgets = $this->get('drafterbit_system.widget.manager')->all();
        foreach ($availableWidgets as &$widget) {
            $newWidget = new Widget;
            $newWidget->setTheme($theme);
            $newWidget->setName($widget->getName());
            $form = $this->get('drafterbit_system.widget.form_builder')->build($widget, $newWidget);
            $widget->form = base64_encode($form);
        }

        $positions = $themeConfig['widget'];

        foreach ($positions as $position) {

            // get current widget
            $widgets[$position] = $this->getWidget($position, $theme);

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

                $widgetObj = $this->get('drafterbit_system.widget.manager')->get($w->getName());
                $widgetObj->setContext($context);

                $w->form = $this->get('drafterbit_system.widget.form_builder')->build($widgetObj, $w);
            }
        }

        return [
            'theme' => $theme,
            'page_title' => $this->get('translator')->trans('Theme Customizer'),
            'available_widget' => $availableWidgets,
            'widgets' => $widgets,
            'option_inputs' => $optionInputs,
            'menu_positions' => $themeConfig['menu'],
            'widget_positions' => $positions,
            'menu_options' => $availableMenus,
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

    /**
     * @Route("/setting/theme/save", name="drafterbit_setting_theme_save")
     */
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
     * Get widget by position and theme
     */
    private function getWidget($position, $theme)
    {
        $em = $this->getDoctrine()->getManager();
        $query = $em->getRepository('DrafterbitSystemBundle:Widget')
            ->createQueryBuilder('w')
            ->where('w.position=:position')
            ->andWhere('w.theme=:theme')
            ->setParameter('position', $position)
            ->setParameter('theme', $theme)
            ->getQuery();

        $widgets = $query->getResult();

        return $widgets;
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
