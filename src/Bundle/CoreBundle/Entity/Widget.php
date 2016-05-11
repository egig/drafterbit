<?php

namespace drafterbit\Bundle\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Widget.
 *
 * @ORM\Table("widget")
 * @ORM\Entity
 * @ORM\Entity(repositoryClass="drafterbit\Bundle\CoreBundle\Repository\WidgetRepository")
 */
class Widget
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
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=150)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="theme", type="string", length=150)
     */
    private $theme;

    /**
     * @var string
     *
     * @ORM\Column(name="position", type="string", length=150)
     */
    private $position;

    /**
     * @var int
     *
     * @ORM\Column(name="sequence", type="integer")
     */
    private $sequence;

    /**
     * @var string
     *
     * @ORM\Column(name="context", type="text")
     */
    private $context;

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
     * Set name.
     *
     * @param string $name
     *
     * @return Widget
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set theme.
     *
     * @param string $theme
     *
     * @return Widget
     */
    public function setTheme($theme)
    {
        $this->theme = $theme;

        return $this;
    }

    /**
     * Get theme.
     *
     * @return string
     */
    public function getTheme()
    {
        return $this->theme;
    }

    /**
     * Set position.
     *
     * @param string $position
     *
     * @return Widget
     */
    public function setPosition($position)
    {
        $this->position = $position;

        return $this;
    }

    /**
     * Get position.
     *
     * @return string
     */
    public function getPosition()
    {
        return $this->position;
    }

    /**
     * Set sequence.
     *
     * @param int $sequence
     *
     * @return Widget
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
     * Set context.
     *
     * @param string $context
     *
     * @return Widget
     */
    public function setContext($context)
    {
        $this->context = $context;

        return $this;
    }

    /**
     * Get context.
     *
     * @return string
     */
    public function getContext()
    {
        return $this->context;
    }
}
