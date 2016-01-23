<?php

namespace Drafterbit\Bundle\SystemBundle\System\Shortcut;

use Drafterbit\System\Extension\Shortcut;

class AppearanceShortcut extends Shortcut
{
    public function getUrl()
    {
        $theme = $this->container->get('system')->get('theme.active');

        $param = [
            'theme' => $theme,
            '_token' => $this->container->get('security.csrf.token_manager')->getToken('customize_theme'),
        ];

        return $this->container->get('router')->generate('dt_setting_theme_customize', $param);
    }

    public function getText()
    {
        return 'Customize';
    }

    public function getIconClass()
    {
        return 'fa fa-desktop';
    }

    public function getTargetWindow()
    {
        return '_blank';
    }
}
