<?php

namespace drafterbit\Bundle\CoreBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\DependencyInjection\ContainerInterface;
use drafterbit\System\FrontPage\FrontPageProvider;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

class FrontpageType extends AbstractType
{
    private $frontpageProvider;
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->frontpageProvider = $container->get('drafterbit.system.application_manager');
        $this->container = $container;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $options = $this->getPageOptions();

        // @todo simplify frontpage options
        foreach ($this->frontpageProvider->getRoutes() as $name => $frontpages) {
            foreach ($frontpages as $frontpage) {
                if ($frontpage->getOptions()) {
                    $options = array_merge($options, $frontpage->getOptions());
                }
            }
        }

        $resolver->setDefaults(array(
            'choices' => $options,
        ));
    }

    public function getParent()
    {
        return ChoiceType::class;
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
            $options[$page->getTitle()] = $page->getSlug();
        }

        return $options;
    }
}
