<?php

namespace Drafterbit\Bundle\SystemBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * @Route("/%admin%/asset")
 */
class AssetController extends Controller
{
    /**
     * @Route("/js/dt.js", name="asset_drafterbit_js")
     */
    public function dtJsAction()
    {
        $content = $this->renderView('DrafterbitSystemBundle:Asset:dt.js.twig');
        return new Response($content, 200, array('Content-Type' => 'application/javascript'));
    }

    /**
     * @Route("/js/session.js", name="drafterbit_system_asset_session_js")
     */
    public function sessionJsAction()
    {
    	$csrf = $this->get('security.csrf.token_manager');
		$token = $csrf->refreshToken('unknown');

        $content = "drafTerbit.csrfToken = '".$token."';";
        $content .= 'drafTerbit.permissions = {
            files: {
                create: "'.$this->isGranted('ROLE_FILE_UPLOAD').'",
                delete: "'.$this->isGranted('ROLE_FILE_DELETE').'",
                move: "'.$this->isGranted('ROLE_FILE_MOVE').'"
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