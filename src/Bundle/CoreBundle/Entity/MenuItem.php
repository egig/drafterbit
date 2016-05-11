<?php

namespace drafterbit\Bundle\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * MenuItem.
 *
 * @ORM\Table("menu_item")
 * @ORM\Entity
 */
class MenuItem
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="\drafterbit\Bundle\CoreBundle\Entity\Menu")
     * @ORM\JoinColumn(name="menu_id", referencedColumnName="id")
     */
    private $menu;

    /**
     * @var string
     *
     * @ORM\Column(name="display_text", type="string", length=50)
     * @Assert\NotBlank()
     */
    private $displayText;

    /**
     * @var string
     *
     * @ORM\Column(name="link", type="string", length=255)
     */
    private $link;

    /**
     * @var int
     *
     * @ORM\Column(name="sequence", type="smallint")
     */
    private $sequence;

    /**
     * @ORM\ManyToOne(targetEntity="\drafterbit\Bundle\CoreBundle\Entity\MenuItem")
     * @ORM\JoinColumn(name="parent_id", referencedColumnName="id")
     */
    private $parent;

    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set menu.
     *
     * @param \stdClass $menu
     *
     * @return MenuItem
     */
    public function setMenu($menu)
    {
        $this->menu = $menu;

        return $this;
    }

    /**
     * Get menu.
     *
     * @return \stdClass
     */
    public function getMenu()
    {
        return $this->menu;
    }

    /**
     * Set displayText.
     *
     * @param string $displayText
     *
     * @return MenuItem
     */
    public function setDisplayText($displayText)
    {
        $this->displayText = $displayText;

        return $this;
    }

    /**
     * Get displayText.
     *
     * @return string
     */
    public function getDisplayText()
    {
        return $this->displayText;
    }

    /**
     * Set link.
     *
     * @param string $link
     *
     * @return MenuItem
     */
    public function setLink($link)
    {
        $this->link = $link;

        return $this;
    }

    /**
     * Get link.
     *
     * @return string
     */
    public function getLink()
    {
        return $this->link;
    }

    /**
     * Set sequence.
     *
     * @param int $sequence
     *
     * @return MenuItem
     */
    public function setSequence($sequence)
    {
        $this->sequence = $sequence;

        return $this;
    }

    /**
     * Get sequence.
     *
     * @return int
     */
    public function getSequence()
    {
        return $this->sequence;
    }

    /**
     * Set parent.
     *
     * @param \stdClass $parent
     *
     * @return MenuItem
     */
    public function setParent($parent)
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * Get parent.
     *
     * @return \stdClass
     */
    public function getParent()
    {
        return $this->parent;
    }
}
