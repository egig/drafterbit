<?php namespace Drafterbit\Extensions\System;

use Drafterbit\Framework\Controller;
use Drafterbit\Extensions\System\Models\Menu;

class BackendController extends Controller
{
    public function __construct()
    {
        $session = $this['session'];

        $this['template']->addGlobal('title', 'Untitled');

        //flash messages
        $messages = $session->getFlashBag()->get('messages');

        $this['template']->addGlobal('messages', $messages);
    }

    private function menu()
    {
        $sorted = [];
        $children = [];
        $i = 0;

        foreach ($this['app']->getNav() as $item) {
            $order = isset($item['order']) ? $item['order'] : $i;
            
            if (isset($item['parent'])) {
                $children[$item['parent']][$order] = $item;

            } else {
                $sorted[$order][] = $item;
            }

            $i++;
        }

        $sorted2 = [];
        foreach ($sorted as $index => $menu) {
            $sorted2 = array_merge($sorted2, array_values($menu));
        }
        
        foreach ($sorted2 as &$menu) {
            if (isset($children[$menu['id']])) {
                ksort($children[$menu['id']]);
                $menu['children'] = $children[$menu['id']];
            }
        }

        ksort($sorted2);

        return $sorted2;
    }
    
    private function createMenu($menuArray)
    {
        $menus = [];

        foreach ($menuArray as $menu) {
            $href = isset($menu['href']) ? $menu['href'] : null;
            $class = isset($menu['class']) ? $menu['class'] : null;
            $id = isset($menu['id']) ? $menu['id'] : null;
            $item = new Menu($menu['label'], $href, $id, $class);
            
            if (isset($menu['children'])) {
                $item->children = $this->createMenu($menu['children']);
            }

            $menus[] = $item;
        }

        return $menus;
    }

    /**
     * Render Template.
     *
     * @param string $template
     * @param array  $data
     */
    public function render($template, $data = [])
    {
        //gravatar
        $session = $this['session'];
        $email = $session->get('user.email');

        $userName = $session->get('user.name') ? $session->get('user.name') : $email;

        $userGravatar = gravatar_url($email, 17);

        $system = $this->model('@system\System')->all();
        
        $this['template']
            ->addGlobal('app', $this['app'])
            ->addGlobal('menus', $this->createMenu($this->menu()))
            ->addGlobal('userName', $userName)
            ->addGlobal('userGravatar', $userGravatar)
            ->addGlobal('siteName', $system['site.name']);

        return $this['template']->render($template, $data);
    }
}
