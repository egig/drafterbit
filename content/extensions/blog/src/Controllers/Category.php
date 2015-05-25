<?php namespace Drafterbit\Blog\Controllers;

use Drafterbit\Base\Controller\Backend as BackendController;
use Drafterbit\Component\Validation\Exceptions\ValidationFailsException;

class Category extends BackendController {

    public function index()
    {
        $data['id'] = 'categories';
        $data['title'] = __('Categories');
        return $this->render('@blog/admin/categories/index', $data);
    }

    public function data($status)
    {
        $categories = $this->model('@blog\Category')->all();

        $pagesArr = [];
        foreach ($categories as $cat) {
            $data = [];
            $data[] = $cat['id'];
            $data[] = $cat['label'];
            $data[] = $cat['description'];

            $pagesArr[] = $data;
        }

        $ob = new \StdClass;
        $ob->data = $pagesArr;
        $ob->recordsTotal= count($pagesArr);
        $ob->recordsFiltered = count($pagesArr);

        return $this->jsonResponse($ob);
    }

    public function edit($id)
    {
        if($id == 'new') {
            $data['title'] = __('New Category');
            
            $data['label'] = '';
            $data['slug'] = '';
            $data['description'] = '';
            $data['parent_id'] = '';

        } else {

            $cat = $this->model('Category')->getOne($id);

            $data['label'] = $cat['label'];
            $data['slug'] = $cat['slug'];
            $data['description'] = $cat['description'];
            $data['parent_id'] = $cat['parent_id'];

            $data['title'] = __('Edit Category');
        }

        $categories = $this->model('@blog\Category')->tree();
        array_unshift($categories, ['id' => 0, 'label' => 'No Parent', 'childrens' => false]);
        $data['categories'] = $categories;
        $data['id'] = 'category-edit';
        $data['catId'] = $id;
        $data['action'] = admin_url('posts/categories/save');
        return $this->render('@blog/admin/categories/edit', $data);
    }

    public function save()
    {
        $model = $this->model('Category');

        try {
            $postData = $this['input']->post();

            $validator = $this['validation.form'];
            $rules = $this['config']->get('validation.category@blog');
            $validator->setRules($rules);

            $postData = $this['input']->post();

            if(empty($postData['title'])) {
                $validator->setRule('slug', 'optional');
            }

            if(empty($postData['slug'])) {
                $postData['slug'] = slug($postData['label']);
            }

            $validator->validate($postData);

            $id = $postData['id'];

            $data['label'] = $postData['label'];
            $data['slug'] = $postData['slug'];
            $data['parent_id'] = $postData['parent_id'];
            $data['description'] = $postData['description'];

            if (is_numeric($id)) {
                $model->update($data, $id);
            
            } else {
                $id = $model->insert($data);
            }

            // @todo log here
            return $this->jsonResponse(['message' => __('Category succesfully saved'), 'status' => 'success', 'id' => $id]);

        } catch (ValidationFailsException $e) {
            return $this->jsonResponse(
                ['error' => [
                    'type' => 'validation',
                    'message' => $e->getMessage(),
                    'messages' => $e->getMessages()
                ]
                ]
            );
        }
    }
}
