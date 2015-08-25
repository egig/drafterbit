<?php

namespace Drafterbit\Bundle\SystemBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drafterbit\System\FrontPage\FrontPageProvider;

class FrontpageType extends AbstractType
{
    private $frontpageProvider;
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->frontpageProvider = $container->get('dt_system.frontpage_provider');
        $this->container = $container;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $options = $this->getPageOptions();

        foreach ($this->frontpageProvider->all() as $name => $frontapage) {
            $options = array_merge($options, $frontapage->getOptions());
        }

        $resolver->setDefaults(array(
            'choices' => $options
        ));
    }

    public function getParent()
    {
        return 'choice';
    }

    public function getName()
    {
        return 'frontapage';
    }

    public function getPageOptions()
    {
        $repo = $this->container->get('doctrine')
            ->getManager()->getRepository('PageBundle:Page');

        $pages = $repo->findAll();

        $options = [];
        foreach ($pages as $page) {
            $options[$page->getSlug()] = $page->getTitle();
        }

        return $options;
    }
}
