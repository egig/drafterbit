<?php

namespace drafterbit\Bundle\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Panel.
 *
 * @ORM\Table("panel")
 * @ORM\Entity
 */
class Panel
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
     * @ORM\Column(name="position", type="string", length=50)
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
     * @ORM\Column(name="type", type="string", length=255)
     */
    private $type;

    /**
     * @ORM\ManyToOne(targetEntity="\drafterbit\Bundle\UserBundle\Entity\User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    private $user;

    /**
     * @var bool
     * 
     * @ORM\Column(name="status", type="boolean")
     */
    private $status;

    /**
     * @var string
     * 
     * @ORM\Column(name="title", type="text", nullable=true)
     */
    private $title;

    /**
     * @var string
     * 
     * @ORM\Column(name="context", type="text", nullable=true)
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
     * Set position.
     *
     * @param string $position
     *
     * @return Panel
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
     * @return Panel
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
     * Set name.
     *
     * @param string $type
     *
     * @return Panel
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get name.
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set user.
     *
     * @param \stdClass $user
     *
     * @return Panel
     */
    public function setUser($user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user.
     *
     * @return \stdClass
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Status.
     */
    public function getStatus()
    {
        return $this->status;
    }

    public function setStatus($status)
    {
        return $this->status = $status;
    }

    /**
     * Title.
     */
    public function getTitle()
    {
        return $this->title;
    }

    public function setTitle($title)
    {
        return $this->title = $title;
    }

    /**
     * Context.
     */
    public function getContext()
    {
        return $this->context;
    }

    public function setContext($context)
    {
        return $this->context = $context;
    }
}
