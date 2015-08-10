<?php

namespace Drafterbit\Bundle\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Entity\User as BaseUser;
use Symfony\Component\Validator\Constraints as Assert;
use UserBundle\Auth\Configuration;

/**
 * @ORM\Entity
 * @ORM\Table(name="user")
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToMany(targetEntity="Drafterbit\Bundle\UserBundle\Entity\Group")
     * @ORM\JoinTable(name="user_group",
     *      joinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="group_id", referencedColumnName="id")}
     * )
     */
    protected $groups;

    /**
     * @Assert\NotBlank()
     */
    protected $username;

    /**
     * @Assert\NotBlank()
     */
    protected $email;

    /**
     * 
     * @ORM\Column(type="string", length=150, nullable=true)
     * @Assert\NotBlank()
     */
    protected $realname;

    /**
     * 
     * @ORM\Column(type="string", length=150, nullable=true)
     * @Assert\Url()
     */
    protected $url;

    /**
     * 
     * @ORM\Column(type="string", length=500, nullable=true)
     */
    protected $bio;

    public function getRealname()
    {
        return $this->realname;
    }

    public function setRealname($realname)
    {
        return $this->realname = $realname;
    }

    public function getUrl()
    {
        return $this->url;
    }

    public function setUrl($url)
    {
        return $this->url = $url;
    }

    public function getBio()
    {
        return $this->bio;
    }

    public function setBio($bio)
    {
        return $this->bio = $bio;
    }
}