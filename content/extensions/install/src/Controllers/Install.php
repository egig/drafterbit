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

            $key = $this->generateKey();

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
             $dest = $this['path.install'].'/config.php';
             
            if (is_writable($dest)) {
                file_put_contents($dest, $content);
            } else {
                $config = $content;
                return json_encode(['config' => $config]);
            }
        
        } catch (\Exception $e) {
            if (in_array($e->getCode(), ['1045', '1044'])) {
                $message = "Database Access Denied";
            } elseif ('1049' == $e->getCode()) {
                $message = "Unknown Database";
            } else {
                $message = $e->getMessage();
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

    public function install()
    {
        $site = $this['input']->post('site');
        $admin = $this['session']->get('install_admin');
         
        $this['config']->load($this['path.install'].'/config.php');

        $config = $this['config'];
        $extMgr = $this['extension.manager'];

         // migrations
        foreach ($extMgr->getCoreExtension() as $extension) {
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

    private function generateKey()
    {
        return str_random(32, true, true);
    }
}