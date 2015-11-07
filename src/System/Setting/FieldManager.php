<?php

namespace Drafterbit\System\Setting;

use Symfony\Component\Form\AbstractType;

class FieldManager
{
    protected $fields = [];

    /**
     * Add field
     *
     * @param FieldInterface
     */
    public function addField(FieldInterface $field)
    {
        $type = $field->getFormType();

        if(!$type instanceof AbstractType) {
            throw new \LogicException("Method getFormType of ".get_class($type)."
                must return instanceof Symfony\Component\Form\AbstractType");
        }

        $this->fields[$type->getName()] = $field;
    }

    /**
     * Get field by name
     *
     * @return FieldInterface
     */
    public function get($name)
    {
        if(!isset($this->fields[$name])) {
            throw new InvalidArgumentException("Unknown field $name");
        }

        return $this->fields[$name];
    }

    /**
     * Get all fields
     *
     * @return arrau
     */
    public function getAll()
    {
        return $this->fields;
    }
}