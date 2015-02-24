<?php namespace Drafterbit\Extensions\Install;

use Drafterbit\Framework\Extension;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class InstallExtension extends Extension
{

    protected $start;

    /**
     * {@inheritdoc}
     */
    public function boot()
    {
        $this['exception']->error(
            function(NotFoundHttpException $e) {
                return redirect(base_url('install'))->send();
            }
        );
    }

    public function setStart($start)
    {
        $this->start = $start;
    }

    public function getStart()
    {
        return $this->start;
    }
}
