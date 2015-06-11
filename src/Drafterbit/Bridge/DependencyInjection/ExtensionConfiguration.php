<?php

namespace Drafterbit\Bridge\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;
use Symfony\Component\DependencyInjection\Extension\Extension as BaseExtension;


abstract class ExtensionConfiguration implements ConfigurationInterface
{
    protected $extension;

    abstract public function getConfigTreeBuilder();

    public function setExtension(BaseExtension $extension)
    {
        $this->extension = $extension;
    }

    public function createRootNode(TreeBuilder $treeBuilder)
    {
        if(!$this->extension) {
            throw new \LogicException("No extension set for configuration class: ".get_class($this));
        }

        return $treeBuilder->root($this->extension->getAlias());
    }
}