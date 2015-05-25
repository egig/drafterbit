<?php namespace Drafterbit\Base\Controller;

use Drafterbit\Base\Controller;
use Drafterbit\Extensions\System\Models\Menu;

class Backend extends Controller
{
    public function __construct()
    {
        $session = $this['session'];

        $this['template']->addGlobal('title', 'Untitled');

        //flash messages
        $messages = $session->getFlashBag()->get('messages');

        $this['template']->addGlobal('messages', $messages);
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
        // @todo screen-opitons

        //gravatar
        $session = $this['session'];
        $email = $session->get('user.email');

        $userName = $session->get('user.name') ? $session->get('user.name') : $email;

        $userGravatar = gravatar_url($email, 17);

        $system = $this->model('@system\System')->all();
        $menus = $this['extension']->data('nav');
        $menus = $this->sortNav($menus);

        $this['template']
            ->addGlobal('app', $this['app'])
            ->addGlobal('menus', $this->createMenu($menus))
            ->addGlobal('userName', $userName)
            ->addGlobal('userGravatar', $userGravatar)
            ->addGlobal('siteName', $system['site.name']);

        return $this['template']->render($template, $data);
    }

    public function sortNav($navs)
    {
        // check if each menu have order defined
        // set 0 if no
        $navs = array_map(function($nav) {
            if(!isset($nav['order'])) {
                $nav['order'] = 0;
            }

            if(!isset($nav['parent'])) {
                $nav['parent'] = false;
            }

            return $nav;
        }, $navs);

        usort($navs, function($a, $b){
            if($a['order'] == $b['order']) {
                return strcasecmp($a['label'] , $b['label']);
            }

            return ($a['order'] > $b['order']) ? 1 : -1;
        });

        return $this->sortMenu($navs);
    }

    private function sortMenu($menus, $parent = false) {
        $sorted = [];

        foreach ($menus as $menu) {
            if($menu['parent'] == $parent) {
                $menu['children'] = $this->sortMenu($menus, $menu['id']);
                $sorted[] = $menu;
            }
        }

        return $sorted;
    }
}
