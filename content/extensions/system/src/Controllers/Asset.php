<?php namespace Drafterbit\Extensions\System\Controllers;

use Symfony\Component\HttpFoundation\Response;
use Drafterbit\Base\Controller\Backend as BackendController;

class Asset extends BackendController
{
	    public function drafterbitJs()
    {
        $data['language'] = $this->model('System')->get('language');
        $data['theme'] = $this['themes']->current();

        $response  = $this->render('@system/drafterbitjs', $data);
        $response = $this['debug'] ? $response : \JSMin::minify($response);

        return new Response(
            $response,
            Response::HTTP_OK,
            [
            'Content-type' => 'application/javascript',
            'Expires' => gmdate('D, d M Y H:i:s \G\M\T', time() + 3600*24*14)
            ]
        );
    }

    public function drafterbitCss()
    {
        $response  = $this->render('@system/drafterbitcss');
        $response = $this['debug'] ? $response : \CssMin::minify($response);

        return new Response(
            $response,
            Response::HTTP_OK,
            [
            'Content-Type' => 'text/css',
            'Expires' => gmdate('D, d M Y H:i:s \G\M\T', time() + 3600*24*14)
            ]
        );
    }

    public function sessionjs()
    {
        $content = "drafTerbit.csrfToken = '".csrf_token()."';";
        $content .= 'drafTerbit.permissions = {
            files: {
                create: "'.has_permission('files.create').'",
                delete: "'.has_permission('files.delete').'",
                move: "'.has_permission('files.move').'"
            }
        }';

        return new Response(
            $content,
            Response::HTTP_OK,
            [
            'Content-Type' => 'application/javascript',
            gmdate('D, d M Y H:i:s \G\M\T', time() + 3600*24*14)
            ]
        );
    }
}