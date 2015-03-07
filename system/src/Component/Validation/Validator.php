<?php namespace Drafterbit\Component\Validation;

class Validator {

    /**
     * Is optional.
     * 
     * @param mixed
     * @return bool
     */
    public function optional($input)
    {
        //whatever
        return true;
    }

    /**
     * Required Rule.
     *
     * @param mixed
     * @return boolean
     */
    public function notEmpty($input)
    {
        if (is_string($input)) {
            return trim($input) !== '';
        }

        if (is_array($input)) {
            return count($input) > 0;
        }

        return !is_null($input);
    }

    /**
     * Email rule.
     *
     * @param mixed
     * @return boolean
     */
    public function email($input)
    {
        return filter_var($input, FILTER_VALIDATE_EMAIL);
    }

    /**
     * More than.
     *
     * @param mixed $input
     * @param int $num
     * @return boolean
     */
    public function greaterThan($input, $num)
    {
        return ( (float) $input > $num);
    }

    /**
     * More than.
     *
     * @param mixed $input
     * @param int $num
     * @return boolean
     */
    public function lowerThan($input, $num)
    {
        return ( (float) $input < $num);
    }

    /**
     * Alpha.
     *
     * @access  public
     * @param   string
     * @return  bool
     */
    public function alpha($str)
    {
        return ( ! preg_match("/^([a-z])+$/i", $str)) ? FALSE : TRUE;
    }

    /**
     * Alpha-numeric.
     *
     * @access  public
     * @param   string
     * @return  bool
     */
    public function alphaNum($str)
    {
        return ( ! preg_match("/^([a-z0-9])+$/i", $str)) ? FALSE : TRUE;
    }

    /**
     * Alpha-numeric with underscores and dashes.
     *
     * @param   string
     * @return  bool
     */
    public function alphaDash($input)
    {
        return ( ! preg_match("/^([-a-z0-9_-])+$/i", $input)) ? FALSE : TRUE;
    }

    /**
     * Exact length, string length.
     *
     * @param mixed $input
     * @param int $num
     * @return boolean
     */
    public function length($input, $num)
    {
        return strlen($input) == $num;
    }

    /**
     * Max length, string length.
     *
     * @param mixed $input
     * @param int $num
     * @return boolean
     */
    public function maxLength($input, $num)
    {
        return strlen($input) < $num;
    }

    /**
     * Min length, string length.
     *
     * @param mixed $input
     * @param int $num
     * @return boolean
     */
    public function minLength($input, $num)
    {
        return strlen($input) > $num;
    }

    /**
     * Match string
     */
    public function matchString($input, $string)
    {
        return $input == $string;
    }


    /**
     * Performs a Regular Expression match test.
     *
     * @access  public
     * @param   string
     * @param   regex
     * @return  bool
     */
    public function matchRegex($str, $regex)
    {
        if (preg_match($regex, $str)) {
            return  TRUE;
        }

        return FALSE;
    }
}