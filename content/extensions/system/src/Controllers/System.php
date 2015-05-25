<?php namespace Drafterbit\Extensions\System\Controllers;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Drafterbit\Base\Controller\Backend as BackendController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Drafterbit\Component\Routing\Annotation\Route;

class System extends BackendController
{
    public function dashboard()
    {
        $data['title'] = __('Dashboard');

        $dashboardWidgets = $this['extension']->data('dashboard_widgets');

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
        $dashboardWidgets = $this['extension']->data('dashboard_widgets');

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

    /**
     * @route_auth 1
     * @route_access log.view
     */
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
            $data[] = $this['log.formatter']->format($log['message']);

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

    public function update()
    {
        $system = $this->model('System');
        $data['ftpHost'] = $system->get('ftp.host');
        $data['ftpPort'] = $system->get('ftp.port');
        $data['ftpUser'] = $system->get('ftp.User');
        $data['ftpPass'] = $system->get('ftp.pass');
        $data['ftpPath'] = $system->get('ftp.path');

        $data['title'] = __('System Update');
        return $this->render('@system/update', $data);
    }

    public function doUpdate()
    {
        // @todo complete this: update extensions, validation etc

        $updatePack = false;

        $pack = $this['input']->files('update_pack');

        $tmp = $this['config']['path.upload'].'/tmp';

        if ($pack instanceof UploadedFile ) {

            $name = $pack->getClientOriginalName();
            if($pack->move($tmp, $name)) {
                $updatePack = $tmp.'/'.$name;
                $extracted = $tmp.'/'.pathinfo($name, PATHINFO_FILENAME);
            }
        }

        $ftpHost = $this['input']->post('ftp_host');
        $ftpPort = $this['input']->post('ftp_port', 21);
        $ftpUser = $this['input']->post('ftp_user');
        $ftpPass = $this['input']->post('ftp_pass');
        $ftpPath = $this['input']->post('ftp_path');

        $this->model('System')->updateSetting([
            'ftp.host' => $ftpHost,
            'ftp.port' => $ftpPort,
            'ftp.User' => $ftpUser,
            'ftp.pass' => $ftpPass,
            'ftp.path' => $ftpPath
        ]);

        // @todo manage path

        if($updatePack) {
            $system = $this['path.system'];
            $system = './'.$this['file']->makePathRelative($system, $ftpPath);
            $system = rtrim($system,'/');
            $systemSrc = $extracted.'/system';
            $systemSrc = './'.$this['file']->makePathRelative($systemSrc, $ftpPath);
            $systemSrc = rtrim($systemSrc,'/');

            file_put_contents($tmp.'/_ftp.php', "<?php return [
                'ftp_host' => '$ftpHost',
                'ftp_port' => '$ftpPort',
                'ftp_user' => '$ftpUser',
                'ftp_pass' => '$ftpPass',
                'system' => '$system',
                'system_src' => '$systemSrc'
            ];");

            $zip = new \ZipArchive;
            $res = $zip->open($updatePack);
            if ($res === TRUE) {
                $zip->extractTo($tmp);
                $zip->close();

                $conn_id = ftp_connect($ftpHost, $ftpPort); 

                // login with username and password
                $login_result = ftp_login($conn_id, $ftpUser, $ftpPass);

                // check connection
                if ((!$conn_id) || (!$login_result)) { 
                    throw new \Exception("FTP connection has failed!");
                }

                $updateFile = './'.$this['file']->makePathRelative($extracted.'/_update.php', $ftpPath);
                $updateFile2 = './'.$this['file']->makePathRelative($this['path.public'].'_update.php', $ftpPath);
                $updateFile = rtrim($updateFile, '/');
                $updateFile2 = rtrim($updateFile2, '/');

                if(! @ftp_rename($conn_id, $updateFile, $updateFile2))
                {
                    return $this->jsonResponse(['message' => 'Can not perform update due to permission problem,
                        please make sure the ftp user has write access to server',
                        'status' => 'error']);
                }

                ftp_chmod($conn_id , 0644, $updateFile2);

                return redirect(base_url('_update.php'));
            }
        }

        return $this->jsonResponse(['message' => 'No Update Pack Submitted', 'status' => 'error']);
    }
}