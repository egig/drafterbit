<?php

namespace drafterbit\Bundle\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="system")
 */
class System
{
    /**
      * @ORM\Id
      * @ORM\Column(type="integer")
      * @ORM\GeneratedValue(strategy="AUTO")
      */
     protected $id;

     /**
      * @ORM\Column(type="string", length=155)
      * @Assert\NotBlank()
      */
     protected $key;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    protected $value;

    public function setKey($key)
    {
        $this->key = $key;
    }

    public function setValue($value)
    {
        $this->value = $value;
    }
}
