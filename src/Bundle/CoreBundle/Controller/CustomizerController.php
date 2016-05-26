<?php

namespace drafterbit\Bundle\CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\Security\Core\Exception\InvalidCsrfTokenException;
use drafterbit\Bundle\CoreBundle\Entity\Widget;

class CustomizerController extends Controller
{
    /**
     * @Route("/setting/theme/customize", name="dt_setting_theme_customize")
     * @Template()
     */
    public function customizeAction(Request $request)
    {
        // safety first
        $token = $request->query->get('_token');
        if (!$this->isCsrfTokenValid('customize_theme', $token)) {
            throw new InvalidCsrfTokenException();
        };

        $theme = $request->query->get('theme');

        $themeManager = $this->get('drafterbit.theme_manager');

        $themePath = $themeManager->getPath($theme);

        $themeConfig = json_decode(file_get_contents(
                $themePath.DIRECTORY_SEPARATOR.'theme.json'), true
            )
        ;

        $availableMenus = [];

        $em = $this->getDoctrine()->getManager();

        $availableMenus[0] = '-- Select Menu --';
        $menus = $em->getRepository('CoreBundle:Menu')->findAll();
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

                $optionInputs[] = $this->renderView('CoreBundle::theme_options.html.twig', ['option' => $option, 'value' => $value]);
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
            $widgets[$position] = $em->getRepository('CoreBundle:Widget')
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
}
