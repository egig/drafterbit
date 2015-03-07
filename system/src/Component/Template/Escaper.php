<?php namespace Drafterbit\Component\Template;

/**
 * The code below was taken from Symfony\Component\Templating
 * Original code and copyright is belong to Fabien Potencier <fabien@symfony.com>
 *
 * @link https://github.com/symfony/Templating/blob/master/PhpEngine.php
 */

class Escaper {

    protected $charset = 'UTF-8';
    protected $escapers;
    protected static $cached;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->initializeBuiltInEscapers();
        foreach ($this->escapers as $context => $escaper) {
            $this->setEscaper($context, $escaper);
        }
    }

    protected function initializeBuiltInEscapers()
    {
        $that = $this;

        $this->escapers = [
            'html' =>
                /**
                 * Runs the PHP function htmlspecialchars on the value passed.
                 *
                 * @param string $value the value to escape
                 *
                 * @return string the escaped value
                 */
                function ($value) use ($that) {
                    // Numbers and Boolean values get turned into strings which can cause problems
                    // with type comparisons (e.g. === or is_int() etc).
                    return is_string($value) ? htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, $that->getCharset(), false) : $value;
                },

            'js' =>
                /**
                 * A function that escape all non-alphanumeric characters
                 * into their \xHH or \uHHHH representations
                 *
                 * @param string $value the value to escape
                 * @return string the escaped value
                 */
                function ($value) use ($that) {
                    if ('UTF-8' != $that->getCharset()) {
                        $value = $that->convertEncoding($value, 'UTF-8', $that->getCharset());
                    }

                    $callback = function ($matches) use ($that) {
                        $char = $matches[0];

                        // \xHH
                        if (!isset($char[1])) {
                            return '\\x'.substr('00'.bin2hex($char), -2);
                        }

                        // \uHHHH
                        $char = $that->convertEncoding($char, 'UTF-16BE', 'UTF-8');

                        return '\\u'.substr('0000'.bin2hex($char), -4);
                    };

                    if (null === $value = preg_replace_callback('#[^\p{L}\p{N} ]#u', $callback, $value)) {
                        throw new \InvalidArgumentException('The string to escape is not a valid UTF-8 string.');
                    }

                    if ('UTF-8' != $that->getCharset()) {
                        $value = $that->convertEncoding($value, $that->getCharset(), 'UTF-8');
                    }
                    
                    return $value;
                },
        ];

        self::$cached = [];
    }

    /**
     * Adds an escaper for the given context.
     *
     * @param string $context The escaper context (html, js, ...)
     * @param mixed  $escaper A PHP callable
     *
     * @api
     */
    public function setEscaper($context, $escaper)
    {
        $this->escapers[$context] = $escaper;
        self::$cached[$context] = [];
    }

    /**
     * Sets the charset to use.
     *
     * @param string $charset The charset
     *
     * @api
     */
    public function setCharset($charset)
    {
        $this->charset = $charset;
    }

    /**
     * Gets the current charset.
     *
     * @return string The current charset
     *
     * @api
     */
    public function getCharset()
    {
        return $this->charset;
    }

    /**
     * Escapes a string by using the current charset.
     *
     * @param mixed  $value   A variable to escape
     * @param string $context The context name
     *
     * @return string The escaped value
     *
     * @api
     */
    public function escape($value, $context = 'html')
    {
        if (is_numeric($value)) {
            return $value;
        }

        // If we deal with a scalar value, we can cache the result to increase
        // the performance when the same value is escaped multiple times (e.g. loops)
        if (is_scalar($value)) {
            if (!isset(self::$cached[$context][$value])) {
                self::$cached[$context][$value] = call_user_func($this->getEscaper($context), $value);
            }

            return self::$cached[$context][$value];
        }

        return call_user_func($this->getEscaper($context), $value);
    }

    /**
     * Gets an escaper for a given context.
     *
     * @param string $context The context name
     *
     * @return mixed  $escaper A PHP callable
     *
     * @throws \InvalidArgumentException
     *
     * @api
     */
    public function getEscaper($context)
    {
        if (!isset($this->escapers[$context])) {
            throw new \InvalidArgumentException(sprintf('No registered escaper for context "%s".', $context));
        }

        return $this->escapers[$context];
    }

    /**
     * Convert a string from one encoding to another.
     *
     * @param string $string The string to convert
     * @param string $to     The input encoding
     * @param string $from   The output encoding
     *
     * @return string The string with the new encoding
     *
     * @throws \RuntimeException if no suitable encoding function is found (iconv or mbstring)
     */
    public function convertEncoding($string, $to, $from)
    {
        if (function_exists('mb_convert_encoding')) {
            return mb_convert_encoding($string, $to, $from);
        } elseif (function_exists('iconv')) {
            return iconv($from, $to, $string);
        }

        throw new \RuntimeException('No suitable convert encoding function (use UTF-8 as your encoding or install the iconv or mbstring extension).');
    }
}