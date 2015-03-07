<?php namespace Drafterbit\Extensions\System\Widgets;

use Drafterbit\App\DashboardWidget as Base;

class DashboardWidget extends Base
{
    public function recent()
    {
        $model = $this['app']->getExtension('system')->model('Log');
        $logs = $model->recent();

        foreach ($logs as &$log) {
            $log = (object)$log;
            $log->time = $this['time']->createFromTimestamp($log->time)->diffForHumans();
            $log->formattedMsg = $model->format($log->message);
        }

        $data['logs'] = $logs;

        return $this['template']->render('@system/dashboard/recent', $data);
    }

    public function info()
    {
        $stat = $this['app']->getStat();

        // site info
        $stat['User(s)'] = count($this['cache']->fetch('users'));
        $stat['OS'] = $this->getOs();
        $stat['PHP'] = phpversion();
        $stat['DB'] = $this['db']->getServerVersion();
        $stat['Time'] = date('H:i:s');
        $stat['Theme'] = $this['themes']->current();
        $stat['Server'] = $this['input']->server('SERVER_SOFTWARE');
        $data['stat'] = $stat;

        return $this['template']->render('@system/dashboard/info', $data);
    }

    public function shortcuts()
    {
        $shortcuts = $this['app']->getShortcuts();

        //dump($shortcuts);

        usort($shortcuts, function($a, $b){
            if($a['order'] == $b['order']) {
                return 0;
            }

            return $a['order'] > $b['order'] ? 1 : -1;
        });


        $shortcuts = array_map(function($item){
            if(!isset($item['window'])) {
                $item['window'] = '_self';
            }

            return $item;
        }, $shortcuts);

        $data['shortcuts'] = $shortcuts;

        return $this['template']->render('@system/dashboard/shortcuts', $data);
    }

    private function getOs()
    {
        $os_platform = "Unknown";

        $os_array = [
            '/windows nt 6.3/i'     =>  'Windows 8.1',
            '/windows nt 6.2/i'     =>  'Windows 8',
            '/windows nt 6.1/i'     =>  'Windows 7',
            '/windows nt 6.0/i'     =>  'Windows Vista',
            '/windows nt 5.2/i'     =>  'Windows Server 2003/XP x64',
            '/windows nt 5.1/i'     =>  'Windows XP',
            '/windows xp/i'         =>  'Windows XP',
            '/windows nt 5.0/i'     =>  'Windows 2000',
            '/windows me/i'         =>  'Windows ME',
            '/win98/i'              =>  'Windows 98',
            '/win95/i'              =>  'Windows 95',
            '/win16/i'              =>  'Windows 3.11',
            '/macintosh|mac os x/i' =>  'Mac OS X',
            '/mac_powerpc/i'        =>  'Mac OS 9',
            '/linux/i'              =>  'Linux',
            '/ubuntu/i'             =>  'Ubuntu',
            '/iphone/i'             =>  'iPhone',
            '/ipod/i'               =>  'iPod',
            '/ipad/i'               =>  'iPad',
            '/android/i'            =>  'Android',
            '/blackberry/i'         =>  'BlackBerry',
            '/webos/i'              =>  'Mobile'
        ];

        foreach ($os_array as $regex => $value) {
            if (preg_match($regex, $this['input']->server('HTTP_USER_AGENT'))) {
                $os_platform = $value;
            }
        }

        return $os_platform;
    }
}
