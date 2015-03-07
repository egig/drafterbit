<?php namespace Drafterbit\Extensions\System\Controllers;

use Drafterbit\Extensions\System\BackendController;
use Drafterbit\Component\Validation\Exceptions\ValidationFailsException;

class Menus extends BackendController
{
    function index()
    {
        $data['title'] = __('Menus');

        $menus = $this->model('Menus')->all();

        foreach ($menus as &$menu) {
            $menu['items'] = $this->model('Menus')->getItems($menu['id']);
        }

        $data['menus'] = $menus;
        $data['pageOptions'] = $this['app']->getFrontPageOption();

        return $this->render('@system/menus', $data);
    }

    function itemSave()
    {
        $post = $this['input']->post();

        try {
            $this->validate('menus', $post);

            $model = $this->model('@system\\Menus');
            $data = $this->createInsertData($post);
            $id = $model->save($post['id'], $data);
            $response = [
                'message' => 'Menu saved',
                'id' => $id,
            ];
        } catch (ValidationFailsException $e) {
            $response = [
                'error' => [
                    'type' => 'validation',
                    'messages' => $e->getMessages(),
                ]
            ];
        }

        return $this->jsonResponse($response);
    }

    function itemDelete()
    {
        $id = $this['input']->post('id');
        return $this->model('Menus')->itemDelete($id);
    }

    private function createInsertData($post)
    {
        $data['label'] = $post['label'];
        $data['type'] = $post['type'];
        $data['link'] = $post['link'];
        $data['page'] = $post['page'];

        return $data;
    }

    public function sort()
    {
        $menus = $this['input']->post('menus');
        $name = $this['input']->post('name');
        $id = $this['input']->post('id');

        $this['db']->update('#_menus', ['name' => $name], ['id' => $id]);

        if($menus) {
            foreach ($menus as $menu) {
                $this['db']->update('#_menu_items', [
                    'parent_id' => $menu['parent'],
                    'sequence' => $menu['sequence'],
                ], ['id' => $menu['id']]);
            }
        }

        return $this->jsonResponse(['message' => 'Menus '.$name.' saved', 'status' => 'success']);
    }

    public function addItem()
    {
        $parentId =  $this['input']->post('menu_id');

        $data = $this->model('Menus')->addItem($parentId);

        return $this->jsonResponse($data);
    }

    public function delete()
    {
        $id = $this['input']->post('id');
        return $this->model('Menus')->delete($id);
    }

    public function add()
    {
        $name = $this['input']->post('name');
        $this['db']->insert('#_menus', ['name' => $name]);

        $id = $this['db']->lastInsertId();

        return $this->jsonResponse(['id' => $id, 'name' => $name, 'slug' => slug($name)]);
    }
}