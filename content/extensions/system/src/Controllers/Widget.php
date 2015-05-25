<?php namespace Drafterbit\Extensions\System\Controllers;

use Drafterbit\Base\Controller\Backend as BackendController;

class Widget extends BackendController
{
    public function delete()
    {
        $id = $this['input']->post('id');
        return $this->model('widget')->remove($id);
    }

    public function save()
    {
        $id  = $this['input']->post('id');
        $title  = $this['input']->post('title');
        $data  = $this['input']->post('data');
        $name  = $this['input']->post('name');
        $position  = $this['input']->post('position');
        $theme  = $this['input']->post('theme');

        $id = $this->model('widget')->save($id, $title, $data, $name, $position, $theme);

        return $this->jsonResponse(['message' => 'Widget saved', 'status' => 'success', 'id' =>  $id]);
    }

    public function sort()
    {
        $ids = $this['input']->post('order');

        $order = 1;
        foreach (array_filter(explode(',', $ids)) as $temp) {
            $temp2 = explode('-', $temp);
            $id = current($temp2);
            $data = ['sequence' => $order];

            $order++;

            $this->model('@system\Widget')->update($id, $data);
        }
        
        return 1;
    }
}
