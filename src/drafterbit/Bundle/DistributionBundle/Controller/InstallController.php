<?php

namespace drafterbit\Bundle\DistributionBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Yaml\Yaml;

class InstallController extends Controller
{
    public function startAction(Request $request)
    {
        if (!$request->query->get('config_pass')) {
            return new RedirectResponse($request->getBasePath().'/config.php');
        }

        return $this->redirectToRoute('_install_step');
    }

    public function stepAction($index, Request $request)
    {
        $installer = $this->get('installer');
        $step = $installer->getStep($index);

        if ($step->isDone()) {
            return $this->redirectToNextStep($index);
        }

        $form = $this->createForm($step->getFormType());
        $processFailed = false;

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $processFailed = $step->process($form->getData(), $installer);

                if (!$processFailed) {
                    return $this->redirectToNextStep($index);
                }
            }
        }

        return $this->render($step->getTemplate(), [
            'form' => $form->createView(),
            'processFailed' => $processFailed,
        ]);
    }

    public function finalAction(Request $request)
    {
        if ($request->getMethod() == 'POST') {
            $installer = $this->get('installer')->finalize();

            return $this->redirectToRoute('_install_done');
        }

        return $this->render('DistributionBundle:Step:final.html.twig');
    }

    public function doneAction(Request $request)
    {
        return $this->render('DistributionBundle:Step:done.html.twig');
    }

    private function redirectToNextStep($index)
    {
        $installer = $this->get('installer');

        ++$index;
        if ($index < $installer->getStepCount()) {
            return $this->redirectToRoute('_install_step', ['index' => $index]);
        }

        return $this->redirectToRoute('_install_final');
    }

    public function doctrineAction(Request $request)
    {
        $index = 0;
        $installer = $this->get('installer');
        $step = $installer->getStep($index);

        if ($step->isDone()) {
            return $this->redirectToNextStep($index);
        }

        $form = $this->createForm($step->getFormType());

        $form->handleRequest($request);

        $processFailed = false;
        if ($form->isValid()) {
            $data = $form->getData();
            $processFailed = $step->process($data, $installer);

            if (!$processFailed) {
                $parametersPath = $this->container->getParameter('parameters_path');
                $templateData = Yaml::parse(file_get_contents($parametersPath.'/parameters.yml.dist'));

                $content = array_replace_recursive($templateData, $this->processData($data));
                $content = trim(Yaml::dump($content, 0));

                $installer->set('doctrine', $data);

                if (is_writable($path = $parametersPath.'/parameters.yml')) {
                    file_put_contents($path, $content);

                    return $this->redirectToNextStep($index);
                } else {
                    return $this->render('DistributionBundle:Step:doctrine-failed.html.twig', ['content' => $content]);
                }
            }
        }

        return $this->render($step->getTemplate(), [
            'form' => $form->createView(),
            'processFailed' => $processFailed,
        ]);
    }

    private function processData($data)
    {
        foreach ($data as $key => $value) {
            $paremeters['database_'.$key] = $value;
        }

        return ['parameters' => $paremeters];
    }
}
