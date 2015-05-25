<?php

namespace Drafterbit\Bundle\SystemBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Menu
 *
 * @ORM\Table("drafterbit_menu")
 * @ORM\Entity
 */
class Menu
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="display_text", type="string", length=50)
     */
    private $displayText;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set displayText
     *
     * @param string $displayText
     * @return Menu
     */
    public function setDisplayText($displayText)
    {
        $this->displayText = $displayText;

        return $this;
    }

    /**
     * Get displayText
     *
     * @return string 
     */
    public function getDisplayText()
    {
        return $this->displayText;
    }
}
