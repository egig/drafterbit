<?php

namespace drafterbit\Bundle\FileBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class FileController extends Controller
{
    /**
     * @Template()
     */
    public function indexAction()
    {
        return [
            'view_id' => 'file',
            'locale' => $this->container->getParameter('locale'),
            'page_title' => $this->get('translator')->trans('File'),
        ];
    }

    /**
     * @Template()
     */
    public function browserAction()
    {
        // @todo filter browser to diplay only image on ckeditor
        return [
            'locale' => $this->container->getParameter('locale'),
        ];
    }

    public function dataAction(Request $request)
    {
        $files = []; // @todo

        $filesArr = [];
        foreach ($files as $file) {
            $data = [];
            $data[] = '';
            $data[] = '';
            $data[] = '';

            $filesArr[] = $data;
        }

        $ob = new \StdClass();
        $ob->data = $filesArr;
        $ob->recordsTotal = count($filesArr);
        $ob->recordsFiltered = count($filesArr);

        return new JsonResponse($ob);
    }
}
