<?php

namespace drafterbit\Bundle\CoreBundle\Controller;

use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\Security\Core\Exception\InvalidCsrfTokenException;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use drafterbit\Bundle\CoreBundle\Form\Type\ThemeType;
use drafterbit\Core\Util;

class SettingController extends Controller
{
    /**
     * @Template()
     * @Security("is_granted('ROLE_SETTING_GENERAL_MANAGE')")
     *
     * @todo Setting validation rules
     * @todo Clear cache on save
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

                $setting = Util::dot($setting);

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
        $themes = [];

        foreach ($this->get('drafterbit.theme_manager')->getPaths() as $themes_path) {
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
                        $ssImage = $this->get('kernel')->getBundle('CoreBundle')->getPath().'/Resources/screenshot.jpg';
                    }

                    $theme['screenshot_base64'] = Util::encodeImage($ssImage);

                    $themes[] = $theme;
                }
            }
        }

        return $themes;
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
}
