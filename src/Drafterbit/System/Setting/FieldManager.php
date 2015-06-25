<?php

namespace Drafterbit\System\Setting;

use Symfony\Component\Form\FormInterface;

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
		$form = $field->getForm();

		if(!$field->getForm() instanceof FormInterface) {
			throw new \LogicException("Method getForm of ".get_class($form)."
				must return instanceof FormInterface");
		}

		$this->fields[$form->getConfig()->getName()] = $form;
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