<?php namespace Drafterbit\Component\Exception;

use Exception;
use Symfony\Component\HttpFoundation\Response;

class PlainDisplayer implements DisplayerInterface {

    /**
     * Error template
     *
     * @var string
     */
    public $template;

    /**
     * Create Plain Displayer instance.
     *
     * @param string @template
     */
    public function __construct( $template = null )
    {
        $this->template = $template;
    }

    /**
     * Display the given exception to the user.
     *
     * @param \Exception $exception
     */
    public function display(Exception $exception)
    {
        $content = 'Something was wrong';

        if($this->isAjaxRequest()) {
            $response = new Response($content, 500);
        } else {
            if( ! is_null($this->template)) {
                $content = file_get_contents( $this->template);
            }
            
            $response = new Response($content, 500);
        }

        $response->send();
    }

    /**
     * Set Template
     * 
     * @param string Template
     */
    public function setTemplate($template)
    {
        $this->template = $template;
    }

    /**
     * Check, if execution will be triggered by an AJAX request.
     *
     * @return bool
     */
    private function isAjaxRequest()
    {
        return (
            !empty($_SERVER['HTTP_X_REQUESTED_WITH'])
            && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')
        ;
    }
}