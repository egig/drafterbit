<?php namespace Drafterbit\Extensions\System\Controllers;

use Symfony\Component\HttpFoundation\Response;
use Drafterbit\Extensions\System\BackendController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use FtpClient\FtpClient;

class System extends BackendController
{
    public function dashboard()
    {
        $data['title'] = __('Dashboard');

        $dashboardWidgets = $this['app']->dashboardWidgets();

        $dashboard = $this->model('@system\System')->get('dashboard');

        $left = $right = [];

        foreach (json_decode($dashboard, true) as $d) {
            if ($d['position'] == 1) {
                $left[$d['id']] = $dashboardWidgets[$d['id']];
            } else {
                $right[$d['id']] = $dashboardWidgets[$d['id']];
            }
        }

        $data['left'] = $left;
        $data['right'] = $right;

        return $this->render('@system/dashboard', $data);
    }

    public function sortDashboard() {
        $dashboardWidgets = $this['app']->dashboardWidgets();
        
        $widgets = array_keys($dashboardWidgets);

        $order = $this['input']->post('order');
        $pos = $this['input']->post('pos');

        $order = explode(',', $order);

        $order = array_map(function($el){
            return substr($el, strlen('dashboard-widget-'));
        }, $order);

        $diff = array_diff($widgets, $order);
        $pos = ($pos == 'left') ? 1 : 2;
        $diffPos = ($pos == 1) ? 2 : 1;

        $data = [];
        foreach ($order as $id) {
            $data[] = ['id' => $id, 'position' => $pos, 'display' => 1];
        }

        foreach ($diff as $id) {
            $data[] = ['id' => $id, 'position' => $diffPos, 'display' => 1];
        }

        $this->model('System')->updateSetting(['dashboard' => json_encode($data)]);
    }

    public function log()
    {
        $action = $this['input']->post('action');
        $logIds = $this['input']->post('log');

        switch($action) {
            case "delete":
                if ($logIds) {
                    foreach ($logIds as $id) {
                        $this->model('@system\Log')->delete($id);
                    }
                    $msg = 'Logs deleted';
                    $this['template']->addGlobal('messages', [['text' => $msg, "type" => 'success']]);
                }
                break;
            case "clear":
                $this->model('@system\Log')->clear();
                $msg = 'Logs cleared';

                $this['template']->addGlobal('messages', [['text' => $msg, "type" => 'success']]);

            default:
                break;
        }

        $data['title'] = __('Logs');
        $data['id'] = 'log';

        return $this->render('@system/log', $data);
    }

    public function logData()
    {
        $logs = $this->model('@system\Log')->all();

        $logArr = [];
        foreach ($logs as $log) {
            
            $data = [];
            $data[] = $log['id'];
            $data[] = date('d-m-Y H:i:s', $log['time']);
            $data[] = $this->model('Log')->format($log['message']);

            $logArr[] = $data;
        }

        $ob = new \StdClass;
        $ob->data = $logArr;
        $ob->recordsTotal= count($logArr);
        $ob->recordsFiltered = count($logArr);

        return $this->jsonResponse($ob);
    }

    public function cache()
    {
        
        $model = $this->model('cache');
        
        $post = $this['input']->post();
        if (isset($post['action'])) {
            
            if($post['action'] == 'clear') {
                $model->clear();
            }
        }

        $caches = $model->getAll();

        $data['id'] = 'cache';
        $data['title']  = __('Cache');
        $data['caches'] = $caches;

        return $this->render('@system/cache', $data);
    }

    public function drafterbitJs()
    {
        $data['language'] = $this->model('System')->get('language');
        $data['theme'] = $this['themes']->current();

        $response  = $this->render('@system/drafterbitjs', $data);
        $response = $this['debug'] ? $response : \JSMin::minify($response);

        return new Response(
            $response,
            Response::HTTP_OK,
            [
            'Content-type' => 'application/javascript',
            'Expires' => gmdate('D, d M Y H:i:s \G\M\T', time() + 3600*24*14)
            ]
        );
    }

    public function drafterbitCss()
    {
        $response  = $this->render('@system/drafterbitcss');
        $response = $this['debug'] ? $response : \CssMin::minify($response);

        return new Response(
            $response,
            Response::HTTP_OK,
            [
            'Content-Type' => 'text/css',
            'Expires' => gmdate('D, d M Y H:i:s \G\M\T', time() + 3600*24*14)
            ]
        );
    }

    public function sessionjs()
    {
        return new Response(
            "drafTerbit.csrfToken = '".csrf_token()."';",
            Response::HTTP_OK,
            [
            'Content-Type' => 'application/javascript'
            ]
        );
    }
}
