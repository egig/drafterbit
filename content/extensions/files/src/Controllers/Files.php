<?php namespace Drafterbit\Extensions\Files\Controllers;

use Drafterbit\Extensions\System\BackendController ;
use Drafterbit\Extensions\Files\Exceptions\FileUploadException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class Files extends BackendController
{

    public function index()
    {
        $data['title'] =  __('Files');
        return $this->render('@files/admin/index', $data);
    }

    private function fixPostMaxSizeIssue()
    {
        // @todo
        // handler post max size affected to upload file
    }
    
    public function browser()
    {
        return $this->render('@files/admin/browser');
    }

    public function data()
    {
        $op = $this['input']->request('op');
        $path = $this['input']->request('path');
        
        $res = new JsonResponse;

        try {
            $data = [];

            switch ($op) {
                case 'ls':
                    $data = $this['ofinder']->ls($path);
                    break;
                case 'delete':
                    $data = $this['ofinder']->delete($path);
                    break;
                case 'mkdir':
                    $folderName = $this['input']->get('folder-name');
                    $data = $this['ofinder']->mkdir($path, $folderName);
                    break;
                case 'rename':
                    $newName = $this['input']->post('newName');
                    $data = $this['ofinder']->rename($path, $newName);
                    break;
                case 'move':
                    $dest = $this['input']->post('dest');
                    $data = $this['ofinder']->move($path, $dest);
                    break;
                case 'properties':
                    $data = $this['ofinder']->properties($path);
                break;
                default:
                     # code...
                    break;
            }

            // upload
            if ($files = $this['input']->files('files', [])) {
                $path = $this['input']->post('path');
                $data = $this['ofinder']->upload($path, $files);
            }

        } catch (\Exception $e) {
            $data = [ 'message' => $e->getMessage(), 'status' => 'error'];
        }
        
        $res->setData($data);

        return $res;
    }
}
