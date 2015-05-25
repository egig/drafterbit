<?php namespace Drafterbit\Base\Log;

class Formatter
{
    const ENTITY_PATTERN = '/:(\w+:[\w]*)/';

    /**
     * Log Entity Labels.
     *
     * @var array
     */
    protected $entityFormatters = [];

    function getEntityLabel($entity, $id)
    {
        return call_user_func_array($this->entityFormatters[$entity], [$id]);
    }

    function addEntityFormatter($entity, $callback)
    {
        $this->entityFormatters[$entity] = $callback;
    }

    /**
     * Format log message
     *
     * @param  string $line
     * @return string
     */
    public function format($line)
    {
        //first we will try translate it
        $line = $this->translate($line);

        // we'll find words formatted like ":user:1"
        // then replace it with format function
        // defined in each extension.
        return preg_replace_callback(
            static::ENTITY_PATTERN,
            function ($matches) {

                $temp = explode(':', $matches[1]);
                
                $entity = current($temp);
                $id = end($temp);

                return $this->getEntityLabel($entity, $id);
            },
            $line
        );
    }

    public function translate($line)
    {
        $chunks = preg_split(static::ENTITY_PATTERN, $line);

        foreach (array_filter($chunks) as $chunk) {
            $chunk = trim($chunk);
            $line = str_replace($chunk, __($chunk), $line);
        }

        return $line;
    }
}