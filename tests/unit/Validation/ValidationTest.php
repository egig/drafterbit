<?php

use Drafterbit\Component\Validation\Validator;

class ValidationTest extends \Codeception\TestCase\Test
{
    protected function _before()
	{
		$this->validator = new Validator;
	}

	function testValidation()
	{
		$this->assertFalse($this->validator->email('test'));
		$this->assertFalse($this->validator->notEmpty(''));
		$this->assertFalse($this->validator->alphaDash('fsdfs$%&$%'));
		$this->assertFalse($this->validator->greaterThan(1,2));
		$this->assertFalse($this->validator->lowerThan(2,1));
		$this->assertFalse($this->validator->minLength('test',5));
		$this->assertFalse($this->validator->maxLength('long-test',5));
	}
}