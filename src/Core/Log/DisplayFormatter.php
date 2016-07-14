<?php

namespace drafterbit\Core\Log;

use Symfony\Component\Translation\TranslatorInterface;

class DisplayFormatter
{
    protected $translator;

    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

    /**
     * Log Entity Labels.
     *
     * @var array
     */
    protected $entityFormatters = [];

    public function addEntityFormatter(EntityFormatterInterface $entityFormatter)
    {
        $this->entityFormatters[$entityFormatter->getName()] = $entityFormatter;
    }

    /**
     * Format log message.
     *
     * @param string $line
     *
     * @return string
     */
    public function format($line, $context = null)
    {
        $context = json_decode($context, true);

        $replaces = [];
        foreach ($context as $key => $value) {
            $replaces['%'.$key.'%'] = $this->resolve($key, $value);
        }

        return $this->translator->trans($line, $replaces);
    }

    private function resolve($entityPlaceholder, $id)
    {
        $entity = trim($entityPlaceholder, '%');

        if ($this->hasEntityFormatter($entity)) {
            return $this->getEntityFormatter($entity)->format($id);
        }

        return "$entity:$id";
    }

    public function getEntityFormatter($entity)
    {
        return $this->entityFormatters[$entity];
    }

    public function hasEntityFormatter($entity)
    {
        return isset($this->entityFormatters[$entity]);
    }
}
