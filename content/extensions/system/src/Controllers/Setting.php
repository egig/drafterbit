<?php namespace Drafterbit\Extensions\System\Controllers;

use Drafterbit\Base\Controller\Backend as BackendController;

class Setting extends BackendController
{

    public function general()
    {
        $post = $this['input']->post();

        if ($post) {
            // @todo validate setting

            $data = $this->setupData($post);
            $this->model('@system\System')->updateSetting($data);
            $this['template']->addGlobal('messages', [['text' => "Setting updated", "type" => 'success']]);
        }

        $system = $this->model('@system\System');

        $pageOptions = [];
        foreach($this['extension']->data('frontpage') as $id => $param) {
            $pageOptions[$id] = $param['label'];
        }


        $data = [
            'siteName'    => $system->get('site.name'),
            'tagLine'     => $system->get('site.description'),
            'adminEmail'  => $system->get('email'),
            'language'    => $system->get('language'),
            'timezone'    => $system->get('timezone'),
            'dateFormat'  => $system->get('format.date'),
            'timeFormat'  => $system->get('format.time'),
            'homepage'    => $system->get('homepage'),
            'smtpHost'    => $system->get('smtp.host'),
            'smtpPort'    => $system->get('smtp.port'),
            'smtpUser'    => $system->get('smtp.user'),
            'smtpPass'    => $system->get('smtp.pass'),
            'pageOptions' => $pageOptions,
            'timezoneIdList' => timezone_identifiers_list(),
            'languageList'   => $this->getLanguageList(),
            'title'       => __('General Setting'),
            'id' => 'setting'
        ];

        return $this->render('@system/setting/general', $data);
    }

    protected function setupData($p)
    {
        $data = [];

        $data['site.name'] = $p['site-name'];
        $data['site.description'] = $p['site-tagline'];
        $data['email'] = $p['email'];
        $data['language'] = $p['language'];
        $data['timezone'] = $p['timezone'];
        $data['format.date'] = $p['format-date'];
        $data['format.time'] = $p['format-time'];

        $data['homepage'] = $p['homepage'];

        $data['smtp.host'] = $p['smtp-host'];
        $data['smtp.port'] = $p['smtp-port'];
        $data['smtp.user'] = $p['smtp-user'];
        $data['smtp.pass'] = $p['smtp-pass'];

        return $data;
    }

    private function getLanguageList()
    {
        return $this['translator']->getLocales();
    }
}
