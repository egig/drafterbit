<?php

namespace Drafterbit\Bundle\FileBundle\Controller\Admin;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class FileController extends Controller
{
    /**
     * @Route("/file", name="dt_file")
     * @Template()
     */
    public function indexAction()
    {
        return [
            'locale' => $this->container->getParameter('locale'),
            'page_title' => $this->get('translator')->trans('File')
        ];
    }

    /**
     * @Route("/file/browser", name="dt_file_browser")
     * @Template()
     */
    public function browserAction()
    {
        // @todo filter browser to diplay only image on ckeditor
        return [
            'locale' => $this->container->getParameter('locale'),
        ];
    }

    /**
     * @Route("/file/data", name="dt_file_data")
     */
    public function dataAction(Request $request)
    {
        $op = $request->get('op');
        $path = $request->get('path');

        $res = new JsonResponse;

        try {
            $data = [];

            switch ($op) {
                case 'ls':
                    $data = $this->get('dt_file.server')->ls($path);
                    break;
                case 'delete':
                    $data = $this->get('dt_file.server')->delete($path);
                    break;
                case 'mkdir':
                    $folderName = $request->get('folder-name');
                    $data = $this->get('dt_file.server')->mkdir($path, $folderName);
                    break;
                case 'rename':
                    $newName = $request->get('newName');
                    $data = $this->get('dt_file.server')->rename($path, $newName);
                    break;
                case 'move':
                    $dest = $request->get('dest');
                    $data = $this->get('dt_file.server')->move($path, $dest);
                    break;
                case 'properties':
                    $data = $this->get('dt_file.server')->properties($path);
                break;
                case 'search':
                    $q = $request->get('q');
                    $data = $this->get('dt_file.server')->search($q, $path);
                break;
                default:
                    break;
            }

            if ($files = $request->files->get('files')) {
                $data = $this->get('dt_file.server')->upload($path, $files);
            }

        } catch (\Exception $e) {
            $data = [ 'message' => $e->getMessage(), 'status' => 'error'];
        }

        $res->setData($data);

        return $res;
    }
}
