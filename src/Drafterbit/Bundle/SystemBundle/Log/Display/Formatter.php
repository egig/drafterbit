<?php

namespace Drafterbit\Bundle\SystemBundle\Log\Display;

use Drafterbit\Bundle\SystemBundle\Log\EntityFormatterInterface;

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
        $callable = [$this->entityFormatters[$entity], 'format'];

        return call_user_func_array($callable, [$id]);
    }

    function addEntityFormatter(EntityFormatterInterface $entityFormatter)
    {
        $this->entityFormatters[$entityFormatter->getName()] = $entityFormatter;
    }

    /**
     * Format log message
     *
     * @param  string $line
     * @return string
     */
    public function format($line)
    {
        // @todo translation

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
}