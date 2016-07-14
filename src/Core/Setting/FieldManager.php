<?php

namespace drafterbit\Core\Setting;

class FieldManager
{
    protected $fields = [];

    /**
     * Add field.
     *
     * @param FieldInterface
     */
    public function addField(FieldInterface $field)
    {
        $type = $field->getFormType();

        if (!is_string($type)) {
            throw new \LogicException('Method getFormType of '.get_class($field).'
                must return class name typed string');
        }

        $this->fields[$field->getName()] = $field;
    }

    /**
     * Get field by name.
     *
     * @return FieldInterface
     */
    public function get($name)
    {
        if (!isset($this->fields[$name])) {
            throw new InvalidArgumentException("Unknown field $name");
        }

        return $this->fields[$name];
    }

    /**
     * Get all fields.
     *
     * @return arrau
     */
    public function getAll()
    {
        return $this->fields;
    }
}
