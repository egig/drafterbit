<?php namespace Drafterbit\Extensions\Install\Controllers;

use Drafterbit\Base\Controller;

class Install extends Controller
{
    public function index()
    {
        try {
            foreach (require __DIR__.'/../requirement.php' as $r) {
                if (! call_user_func_array($r['function'], [$this['app']])) {
                    throw new \Exception($r['message']);
                }
            }
        } catch (\Exception $e) {
            $data['message'] = $e->getMessage();
            return $this->render('requirement', $data);
        }

        $start = $this->getExtension()->getStart();
        
        $data['start'] = $start;
        $data['preloader'] = base_url($this['dir.content'].'/extensions/install/src/Resources/public/img/preloader.GIF');

        return $this->render('install', $data);
    }

    public function check()
    {
        $message = 'ok';

        try {

            $config = $this['input']->post('database');
            $this['config']->set('database', $config);

            $this['db']->connect();
            
            $this['session']->set('install_db', $config);

            $db = $this['session']->get('install_db');
            $stub = $this->getExtension()->getResourcesPath('stub/config.php.stub');

            $string = file_get_contents($stub);

            if(!$db['host']) {
                throw new \Exception("Host can not be empty");
            }

            if(!$db['dbname']) {
                throw new \Exception("Database can not be empty");
            }

            $key = str_random(32, true, true);

            $config = [
                '%key%' => $key,
                '%db.driver%' => $db['driver'],
                '%db.host%' => $db['host'],
                '%db.user%' => $db['user'],
                '%db.pass%' => $db['password'],
                '%db.name%' => $db['dbname'],
                '%db.prefix%' => $db['prefix']
             ];

             $content = strtr($string, $config);
             $dest = $this['path.public'].'/config.php';
             
            if (is_writable($dest)) {
                file_put_contents($dest, $content);
            } else {
                return json_encode(['config' => $content]);
            }
        
        } catch (\Exception $e) {

            switch ($e->getCode()) {
                case 1044:
                case 1045:
                    $message = "Database Access Denied";
                    break;
                case 1049:
                    $message = "Unknown Database";
                    break;
                default:
                    $message = $e->getMessage();
                    break;
            }
        }

        return json_encode(['message' => $message]);
    }

    public function admin()
    {
        $admin = $this['input']->post('admin');
        $this['session']->set('install_admin', $admin);

        // @todo validation admin email and password
        return json_encode(['message' => 'ok']);
    }

    public function doInstall()
    {
        $site = $this['input']->post('site');
        $admin = $this['session']->get('install_admin');
         
        $this['config']->load($this['path.public'].'config.php');

        $config = $this['config'];
        $extMgr = $this['extension'];

         // migrations
        foreach (['system', 'user', 'pages', 'blog', 'files'] as $extension) {
            // add and return the extension
            $ext = $extMgr->get($extension);
            if (is_dir($ext->getResourcesPath('migrations'))) {
                $this['migrator']->create($ext->getResourcesPath('migrations'))->run();
            }
        }

         $model = $this->model('Install');
         
         //add first user(admin)
         $adminIds = $model->createAdmin($admin['email'], $admin['password']);
         
         //add system default
         $model->systemInit($site['name'], $site['desc'], $admin['email'], $adminIds['userId']);

         return $this->jsonResponse(['message' => 'ok']);
    }
}