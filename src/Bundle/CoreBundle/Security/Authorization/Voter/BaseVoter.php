<?php
// src/AppBundle/Security/Authorization/Voter/PostVoter.php
namespace drafterbit\Bundle\CoreBundle\Security\Authorization\Voter;

use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use drafterbit\Bundle\CoreBundle\Security\Authorization\AttributeProvider;

class BaseVoter implements VoterInterface
{
    private $attributeProvider;

    public function __construct(AttributeProvider $attributeProvider)
    {
        $this->attributeProvider = $attributeProvider;
    }

    public function supportsAttribute($attribute)
    {
        return array_key_exists($attribute, $this->attributeProvider->all());
    }

    public function supportsClass($class)
    {
        return  true;
    }

    public function vote(TokenInterface $token, $object, array $attributes)
    {
        // check if class of this object is supported by this voter
        if (!$this->supportsClass(get_class($object))) {
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

        // simply
        if ($user->hasRole('ROLE_SUPER_ADMIN')) {
            return VoterInterface::ACCESS_GRANTED;
        }
        if ($user->hasRole($attribute)) {
            return VoterInterface::ACCESS_GRANTED;
        }

        return VoterInterface::ACCESS_DENIED;
    }
}
