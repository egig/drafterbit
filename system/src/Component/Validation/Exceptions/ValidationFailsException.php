<?php namespace Drafterbit\Component\Validation\Exceptions;

use Exception;

class ValidationFailsException extends Exception {

    private $messages;

    public function setMessages($messages)
    {
        $this->messages = $messages;
    }

    public function getMessages()
    {
        return $this->messages;
    }
}