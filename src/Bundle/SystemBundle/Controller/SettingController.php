<?php

namespace Drafterbit\Bundle\SystemBundle\Controller;

use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\Security\Core\Exception\InvalidCsrfTokenException;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Drafterbit\Bundle\SystemBundle\Entity\Widget;
use Drafterbit\Bundle\SystemBundle\Form\Type\ThemeType;

class SettingController extends Controller
{
    /**
     * @Template()
     * @Security("is_granted('ROLE_SETTING_GENERAL_MANAGE')")
     *
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
        $fields = ['system' => $fields['system']] + $fields;

        $notif['message'] = false;

        if ($request->isXmlHttpRequest()) {
            $mainForm->handleRequest($request);

            if ($mainForm->isValid()) {
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
            'fields' => $fields,
        ];

        return array_merge($data, $notif);
    }

    /**
     * @Route("/setting/theme", name="dt_system_setting_theme")
     * @Template()
     * @Security("is_granted('ROLE_SETTING_THEME_MANAGE')")
     */
    public function themeAction(Request $request)
    {
        $theme = $request->request->get('theme');
        $_token = $request->request->get('_csrf_token');

        if ($theme) {
            if (!$this->isCsrfTokenValid(ThemeType::CSRF_TOKEN_ID, $_token)) {
                throw new InvalidCsrfTokenException();
            }

            $this->get('system')->set('theme.active', $theme);
        }

        $themes = $this->getThemes();
        $csrfToken = $this->get('security.csrf.token_manager')
            ->getToken(ThemeType::CSRF_TOKEN_ID);

        return [
            'page_title' => $this->get('translator')->trans('Theme'),
            'themes' => $themes,
            '_token' => $csrfToken,
        ];
    }

    /**
     * Get all themes.
     *
     * @todo move this to its own manaegment: ThemeManager
     *
     * @return array
     */
    private function getThemes()
    {
        $themes_path = $this->container->getParameter('themes_path');

        $themes = [];
        $dirs = (new Finder())->in($themes_path)->directories()->depth(0);

        foreach ($dirs as $dir) {
            if (file_exists($config = $dir->getRealpath().'/theme.json')) {
                $theme = json_decode(file_get_contents($config), true);

                $theme['is_active'] = ($theme['id'] == $this->get('system')->get('theme.active'));

                $ssImage = null;
                if (isset($theme['screenshot'])) {
                    $ssImage = $dir->getRealpath().DIRECTORY_SEPARATOR.$theme['screenshot'];
                }

                if (!file_exists($ssImage)) {
                    $ssImage = $this->get('kernel')->getBundle('SystemBundle')->getPath().'/Resources/screenshot.jpg';
                }

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
    private function encodeImage($imagePath)
    {
        $extension = pathinfo($imagePath, PATHINFO_EXTENSION);

        $imgBinary = fread(fopen($imagePath, 'r'), filesize($imagePath));

        return 'data:image/'.$extension.';base64,'.base64_encode($imgBinary);
    }

    /**
     * @Route("/setting/theme/customize", name="dt_setting_theme_customize")
     * @Template()
     */
    public function customizerAction(Request $request)
    {
        // safety first
        $token = $request->query->get('_token');
        if (!$this->isCsrfTokenValid('customize_theme', $token)) {
            throw new InvalidCsrfTokenException();
        };

        $theme = $request->query->get('theme');

        $themesPath = $this->container->getParameter('themes_path');

        $themeConfig = json_decode(file_get_contents(
                $themesPath.DIRECTORY_SEPARATOR.$theme.DIRECTORY_SEPARATOR.'theme.json'), true
            )
        ;

        $availableMenus = [];

        $em = $this->getDoctrine()->getManager();

        $availableMenus[0] = '-- Select Menu --';
        $menus = $em->getRepository('SystemBundle:Menu')->findAll();
        foreach ($menus as $menu) {
            $availableMenus[$menu->getId()] = $menu->getDisplayText();
        }

        $context = $this->get('system')->get(sprintf('theme.%s.context', $theme), '');
        $themeMenus = $this->get('system')->get(sprintf('theme.%s.menu', $theme), '');
        $themeMenuIds = json_decode($themeMenus, true);

        $context = json_decode($context, true);

        $optionInputs = [];
        if (isset($themeConfig['option'])) {
            foreach ($themeConfig['option'] as $option) {
                if (isset($context[$option['name']])) {
                    $value = $context[$option['name']];
                } else {
                    $value = isset($option['default']) ? $option['default'] : null;
                }

                $optionInputs[] = $this->renderView('SystemBundle::theme_options.html.twig', ['option' => $option, 'value' => $value]);
            }
        }

        $availableWidgets = $this->get('dt_system.widget.manager')->all();
        foreach ($availableWidgets as &$widget) {
            $newWidget = new Widget();
            $newWidget->setTheme($theme);
            $newWidget->setName($widget->getName());
            $form = $this->get('dt_system.widget.form_builder')->build($widget, $newWidget);
            $widget->form = base64_encode($form);
        }

        // @todo validate theme config
        $positions = isset($themeConfig['widget']) ? $themeConfig['widget'] : [];

        $widgets = [];
        foreach ($positions as $position) {

            // get current widget
            $widgets[$position] = $em->getRepository('SystemBundle:Widget')
                ->getByThemePosition($position, $theme);

            usort(
                $widgets[$position],
                function ($a, $b) {
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
            'menu_positions' => (isset($themeConfig['menu']) ? $themeConfig['menu'] : []),
            'widget_positions' => $positions,
            'menu_options' => $availableMenus,
            'theme_menu_ids' => $themeMenuIds,
        ];
    }

    public function themeSaveAction(Request $request)
    {
        $context = $request->request->get('context');
        $general = $request->request->get('general');

        $theme = $request->request->get('theme');
        if ($menus = $request->request->get('menus')) {
            $menus = json_encode($menus);
        }

        if ($request->request->get('action') == 'save') {
            $this->container->get('system')->update(
                [
                'sitename' => $general['title'],
                'tagline' => $general['tagline'],
                'theme.'.$theme.'.menu' => $menus,
                'theme.'.$theme.'.context' => json_encode($context),
                ]
            );
        }

        $url = $request->request->get('url');

        return new JsonResponse(
            [
                'message' => $this->get('translator')->trans('Theme Saved'),
                'status' => 'success',
                'url' => $url,
            ]
        );
    }

    /**
     * Flatten a multi-dimensional associative array with dots.
     *
     * @param array  $array
     * @param string $prepend
     *
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
