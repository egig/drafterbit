<?php

namespace Drafterbit\Bundle\BlogBundle\Security\Authorization\Voter;

use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

use Drafterbit\Bundle\SystemBundle\Security\Authorization\AttributeProvider;
use Drafterbit\Bundle\BlogBundle\Entity\Post;

class PostVoter implements VoterInterface
{
    const EDIT = 'post.edit';

    public function supportsAttribute($attribute)
    {
        return in_array($attribute, [
            self::EDIT
        ]);
    }

    public function supportsClass($class)
    {
        $supportedClass = "Drafterbit\Bundle\BlogBundle\Entity\Post";;

        return $supportedClass === $class || is_subclass_of($class, $supportedClass);
    }

    public function vote(TokenInterface $token, $post, array $attributes)
    {
        // check if class of this object is supported by this voter
        if (!$this->supportsClass(get_class($post))) {
            return VoterInterface::ACCESS_ABSTAIN;
        }

        // check if the voter is used correct, only allow one attribute
        // this isn't a requirement, it's just one easy way for you to
        // design your voter
        if (1 !== count($attributes)) {
            throw new \InvalidArgumentException(
                'Only one attribute is allowed'
            );
        }

        // set the attribute to check against
        $attribute = $attributes[0];

        // check if the given attribute is covered by this voter
        if (!$this->supportsAttribute($attribute)) {
            return VoterInterface::ACCESS_ABSTAIN;
        }

        // get current logged in user
        $user = $token->getUser();

        // make sure there is a user object (i.e. that the user is logged in)
        if (!$user instanceof UserInterface) {
            return VoterInterface::ACCESS_DENIED;
        }

        if ($user->hasRole('ROLE_SUPER_ADMIN')) {
            return VoterInterface::ACCESS_GRANTED;
        }

        // post is new
        if(!$post->getUser()) {
            return VoterInterface::ACCESS_GRANTED;
        }

        if ($user->getId() === $post->getUser()->getId()) {
            return VoterInterface::ACCESS_GRANTED;
        }

        return VoterInterface::ACCESS_DENIED;
    }
}