<?php

namespace drafterbit\Bundle\CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AssetController extends Controller
{
    public function dtJsAction()
    {
        $locale = $this->container->getParameter('locale');
        $dict = $this->get('translator')->getCatalogue($locale)->all('messages');
        $data['dict'] = json_encode($dict);
        $content = $this->renderView('CoreBundle:Asset:dt.js.twig', $data);

        return new Response($content, 200, array('Content-Type' => 'application/javascript'));
    }

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
            gmdate('D, d M Y H:i:s \G\M\T', time() + 3600 * 24 * 14),
            ]
        );
    }
}
