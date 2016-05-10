<?php

namespace drafterbit\Bundle\CoreBundle\Security\Authorization;

use Symfony\Component\HttpKernel\Kernel;

class AttributeProvider
{
    protected $kernel;

    public function __construct(Kernel $kernel)
    {
        $this->kernel = $kernel;
    }

    /**
     * Get all permission attribute.
     */
    public function all()
    {
        $rolesGroup = $this->getPerBundle();

        $attr = [];
        foreach ($rolesGroup as $bundle => $attributes) {
            foreach ($attributes as $key => $value) {
                $attr[$key] = $value;
            }
        }

        return $attr;
    }

    /**
     * Get permission attribute per bundle.
     *
     * @return array
     */
    public function getPerBundle()
    {
        $container = $this->kernel->getContainer();
        $bundles = $this->kernel->getBundles();

        $roles = [];
        foreach ($bundles as $name => $bundle) {
            if ($extension = $bundle->getContainerExtension()) {
                $parameter = $extension->getAlias().'.roles';
                $section = ucfirst(preg_replace('/^dt_/', '', $extension->getAlias()));
                if ($container->hasParameter($parameter)) {
                    $roles[$section] = $container->getParameter($parameter);
                }
            }
        }

        return $roles;
    }
}
