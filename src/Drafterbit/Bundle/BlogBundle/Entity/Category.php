<?php

namespace Drafterbit\Bundle\BlogBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Category
 *
 * @ORM\Entity
 * @ORM\Table(name="drafterbit_category")
 */
class Category
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
     * @ORM\Column(name="slug", type="string", length=150)
     * @Assert\Regex(pattern="/^[a-z0-9-]+$/", message="Slug must only contain alphanumeric and hypen")
     * @Assert\NotBlank()
     */
    private $slug;

    /**
     * @var string
     *
     * @ORM\Column(name="label", type="string", length=150)
     * @Assert\NotBlank()
     */
    private $label;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=500, nullable=true)
     */
    private $description;

    /**
     * @ORM\ManyToOne(targetEntity="\Drafterbit\Bundle\BlogBundle\Entity\Category")
     * @ORM\JoinColumn(name="parent_id", referencedColumnName="id")
     */
    private $parent;


    public function getId()
    {
    	return $this->id;
    }

    public function getSlug()
    {
    	return $this->slug;
    }

    public function setSlug($slug)
    {
    	$this->slug = $slug;
    }

    public function setLabel($label)
    {
    	$this->label = $label;
    }

    public function getLabel()
    {
    	return $this->label;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setParent($parent)
    {
        $this->parent = $parent;
    }

    public function getParent()
    {
        return $this->parent;
    }
}