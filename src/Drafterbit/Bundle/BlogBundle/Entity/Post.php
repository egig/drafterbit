<?php

namespace Drafterbit\Bundle\BlogBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * Post.
 *
 * @ORM\Entity(repositoryClass="Drafterbit\Bundle\BlogBundle\Repository\PostRepository")
 * @ORM\Table(name="post")
 * @UniqueEntity("slug")
 */
class Post
{
    const TYPE_STANDARD = 'standard';
    const STATUS_PENDING = 0;
    const STATUS_PUBLISHED = 1;

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="\Drafterbit\Bundle\UserBundle\Entity\User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    private $user;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=150)
     * @Assert\NotBlank()
     */
    private $title;

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
     * @ORM\Column(name="content", type="text", nullable=true)
     */
    private $content;

    /**
     * @var string
     *
     * @ORM\Column(name="type", type="string", length=20)
     */
    private $type;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime")
     */
    private $createdAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime")
     */
    private $updatedAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="deleted_at", type="datetime", nullable=true)
     */
    private $deletedAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="published_at", type="datetime")
     */
    private $publishedAt;

    /**
     * @var bool
     *
     * @ORM\Column(name="status", type="boolean")
     */
    private $status;

    /**
     * @ORM\ManyToMany(targetEntity="Drafterbit\Bundle\BlogBundle\Entity\Category")
     * @ORM\JoinTable(name="post_category",
     *      joinColumns={@ORM\JoinColumn(name="post_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="category_id", referencedColumnName="id")}
     * )
     *
     * @var collection
     */
    protected $categories;

    /**
     * @ORM\ManyToMany(targetEntity="Drafterbit\Bundle\BlogBundle\Entity\Tag")
     * @ORM\JoinTable(name="post_tag",
     *      joinColumns={@ORM\JoinColumn(name="post_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="tag_id", referencedColumnName="id")}
     * )
     *
     * @var collection
     */
    protected $tags;

    /**
     * @ORM\OneToMany(targetEntity="Drafterbit\Bundle\BlogBundle\Entity\Comment", mappedBy="post")
     *
     * @var collection
     */
    protected $comments;

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
     * Get idUser.
     *
     * @return int
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set idUser.
     *
     * @param int $idUser
     *
     * @return Page
     */
    public function setUser($user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Set title.
     *
     * @param string $title
     *
     * @return Page
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title.
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set slug.
     *
     * @param string $slug
     *
     * @return Page
     */
    public function setSlug($slug)
    {
        $this->slug = $slug;

        return $this;
    }

    /**
     * Get slug.
     *
     * @return string
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * Set content.
     *
     * @param string $content
     *
     * @return Page
     */
    public function setContent($content)
    {
        $this->content = $content;

        return $this;
    }

    /**
     * Get content.
     *
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Set Type.
     *
     * @param string $type
     *
     * @return Post
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get content.
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set createdAt.
     *
     * @param \DateTime $createdAt
     *
     * @return Page
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt.
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt ? $this->createdAt : new \DateTime();
    }

    /**
     * Set updatedAt.
     *
     * @param \DateTime $updatedAt
     *
     * @return Page
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt.
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt ? $this->updatedAt : new \DateTime();
    }

    /**
     * Set deletedAt.
     *
     * @param \DateTime $deletedAt
     *
     * @return Page
     */
    public function setDeletedAt($deletedAt)
    {
        $this->deletedAt = $deletedAt;

        return $this;
    }

    /**
     * Get deletedAt.
     *
     * @return \DateTime
     */
    public function getDeletedAt()
    {
        return $this->deletedAt ? $this->deletedAt : new \DateTime('0000-00-00');
    }

    /**
     * Set publishedAt.
     *
     * @param \DateTime $deletedAt
     *
     * @return Page
     */
    public function setPublishedAt($publishedAt)
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }

    /**
     * Get deletedAt.
     *
     * @return \DateTime
     */
    public function getPublishedAt()
    {
        return $this->publishedAt ? $this->publishedAt : new \DateTime();
    }

    /**
     * Set status.
     *
     * @param bool $status
     *
     * @return Page
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status.
     *
     * @return bool
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Get Category.
     *
     * @return collection
     */
    public function getCategories()
    {
        return $this->categories ? $this->categories : new ArrayCollection();
    }

    /**
     * Get Tags.
     *
     * @return collection
     */
    public function setCategories($categories)
    {
        return $this->categories = $categories;
    }

    /**
     * Get Tags.
     *
     * @return collection
     */
    public function getTags()
    {
        return $this->tags ? $this->tags : new ArrayCollection();
    }

    /**
     * Set Category.
     *
     * @return Post
     */
    public function setTags($tags)
    {
        $this->tags = $tags;

        return $this;
    }

    /**
     * Get Comments.
     *
     * @return collection
     */
    public function getComments()
    {
        return $this->comments ? $this->comments : new ArrayCollection();
    }

    /**
     * Set Comments.
     *
     * @return Post
     */
    public function setComments($comments)
    {
        $this->comments = $comments;

        return $this;
    }
}
