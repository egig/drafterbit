<?php namespace Drafterbit\Component\Validation;

use Drafterbit\Component\Validation\Validator;
use Drafterbit\Component\Translation\Translator;

class Form {

    /**
     * Data to validate.
     *
     * @var array
     */
    protected $data = [];

    /**
     * Rule to use.
     *
     * @var array;
     */
    protected $rules = [];

    /**
     * Label to in error msg.
     *
     * @var array;
     */
    protected $labels;

    /**
     * Error messages.
     *
     * @var array
     */
    protected $errorMessages;

    /**
     * The Validator.
     *
     * @var object
     */
    protected $validator;

    /**
     * Translator.
     *
     * @var object
     */
    protected $translator;

    /**
     * Constructor
     *
     * @return boid
     */
    public function __construct( Validator $validator, Translator $translator)
    {
        $this->validator = $validator;
        $this->translator = $translator;
    }

    /**
     * Do validation, populate error message.
     *
     * @param array $data
     * @param array $rules
     * @param bool $throwException
     * @return bool
     */
    public function validate($data, $rules = [], $throwException = true)
    {
        $result = false;
        
        $this->data = array_merge_recursive($this->data, $data);
        $this->rules = array_merge_recursive($this->rules, $rules);

        //if no data for a rule, we'll create it null
        foreach ($this->rules as $key => $value) {
            if(!isset($this->data[$key])) {
                $this->data[$key] = null;
            }
        }

        foreach( $this->data as $key => $value ) {

            if( ! isset($this->rules[$key])) {
                continue;
            }

            foreach( $this->rules[ $key ] as $ruleId ) {
                
                list( $rule, $params, $useOtherField) = $this->parseRule( $ruleId );

                $method = camel_case($rule);
                
                if( ! call_user_func_array( [$this, $method], array_merge([$value], $params))) {
                    if( $result === true )
                        $result = false;

                    if( ! isset($this->errorMessages[$key] )) {
                        $this->errorMessages[$key] = $this->createErrorMessage($key, $rule, $params, $useOtherField);
                    }
                }
            }
        }

        if($throwException and count($this->errorMessages) > 0) {
            $e = new Exceptions\ValidationFailsException('Validation Fails');

            $e->setMessages($this->errorMessages);

            throw $e;
        }
        
        return $result;
    }

    /**
     * Parse given rule key.
     *
     * @param string
     */
    private function parseRule( $rule )
    {
        $param = [];
        $involveOtherField = false;

        if( strpos($rule, '=') !== false ) {
            $array = explode('=', $rule);

            $rule = current($array);
            $param = explode(',', end($array));
        }

        if(in_array($rule, ['match'])) {
            $involveOtherField = true;
        }

        return [$rule, $param, $involveOtherField];
    }

    /**
     * Set named rules
     *
     * @param string $name
     * @param array rules
     */
    public function setRule($name, $rules)
    {
        $this->rules[$name] = (array)$rules;
    }

    /**
     * Create label for error msg.
     *
     * @param string $key
     * @param string $label
     */
    public function setLabel( $key, $label )
    {
        $this->labels[ $key ] = $label;
    }


    /**
     * Set bunch of data to validate
     *
     * @param array $rules
     * @return self
     */
    public function setRules( $rules )
    {
        foreach( $rules as $ruleName => $property)
        {
            $this->setRule( $ruleName, $property['rules'] );
            $this->setLabel( $ruleName, $property['label'] );
        }

        return $this;
    }


    /**
     * Create Error Message
     *
     * @param string $key
     * @param string $rule
     * @return string
     */
    protected function createErrorMessage($key, $rule, $ruleParams = null, $involveOtherField = false)
    {
        if ($involveOtherField) {
            $parsedRuleParams = [];
    
            foreach ($ruleParams as $rp) {
                if (isset($this->data[$rp])) {
                    $parsedRuleParams[] = $this->getLabel($rp);
                } else {
                    $parsedRuleParams[] = $rp;
                }
            }
        } else {
            $parsedRuleParams = $ruleParams;
        }

        $args = [];
        for($i=0;$i<count($parsedRuleParams);$i++) {
            $args["%arg[$i]%"] = $parsedRuleParams[$i];
        }

        $label = $this->getLabel($key);
        
        $langArgs = array_merge(['%field%' => $label], $args);

        $message = $this->getDefaultMessage($rule);
        
        if($message) {
            return $this->translator->trans($message, $langArgs);
        }

        return "Something's wrong with '$label'";
    }

    /**
     * Get Default error Message 
     *
     * @param string $rule
     * @return string
     */
    private function getDefaultMessage($rule)
    {
        $msgs = require __DIR__.'/default-error-messages.php';

        return isset($msgs[$rule])  ? $msgs[$rule] : false;
    }

    /**
     * Create label for error msg.
     *
     * @param string $key
     */
    public function getLabel( $key )
    {
        return isset($this->labels[$key]) ?
            $this->translator->trans($this->labels[$key]) :
            $key;
    }

    /**
     * Determine wether error is occured
     *
     * @return boolean
     */
    public function hasErrorMessages()
    {
        return (count( $this->errorMessages ) > 0);
    }

    /**
     * Get error is messages.
     *
     * @return boolean
     */
    public function getErrorMessages()
    {
        return array_values($this->errorMessages);
    }

    /**
     * Get Translator.
     *
     * @return object
     */
    public function getTranslator()
    {
        return $this->translator;
    }

    /**
     * handle match rule
     *
     * @param string $input
     * @param string $ruleName
     */
    public function match($input, $ruleName)
    {
        $compare = $this->data[$ruleName];
        return $this->validator->matchString($input, $compare);
    }

    /**
     * Dynamically call validator
     *
     * @return mixed
     */
    public function __call($method, $param)
    {
        return call_user_func_array([$this->validator, $method], $param);
    }
}