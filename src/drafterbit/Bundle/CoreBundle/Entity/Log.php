<?php

namespace drafterbit\Bundle\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="log")
 */
class Log
{
    /**
      * @ORM\Id
      * @ORM\Column(type="integer")
      * @ORM\GeneratedValue(strategy="AUTO")
      */
     protected $id;

     /**
      * @ORM\Column(type="string", length=45)
      */
     protected $channel;

    /**
     * @ORM\Column(type="integer")
     */
    protected $level;

    /**
     * @ORM\Column(type="text")
     */
    protected $message;

    /**
     * @ORM\Column(type="integer")
     */
    protected $time;

    /**
     * @ORM\Column(type="text")
     */
    protected $context;

    public function getId()
    {
        return $this->id;
    }

    public function getChannel()
    {
        return $this->channel;
    }

    public function getLevel()
    {
        return $this->level;
    }

    public function getMessage()
    {
        return $this->message;
    }

    public function getTime()
    {
        return $this->time;
    }

    public function getContext()
    {
        return $this->context;
    }
}
