<?php

namespace drafterbit\Bundle\PageBundle\Form\Type;

use Symfony\Component\Finder\Finder;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class PageType extends AbstractType
{
    private $container = null;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $layoutOptions = $this->getLayoutOptions();

        $builder
            ->add('id', HiddenType::class, ['mapped' => false])
            ->add('title', TextType::class, ['required' => true])
            ->add('slug', TextType::class, ['required' => true])
            ->add('content', TextType::class)
            ->add('layout', ChoiceType::class, [
                    'choices' => $layoutOptions,
                ])
            ->add('status', ChoiceType::class, [
                    'choices' => [
                        'Published' => 1,
                        'Pending Review' => 0,
                    ],
                ])
            ->add('Save', SubmitType::class);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'required' => false,
        ]);
    }

    public function getName()
    {
        return 'page';
    }

    /**
     * Get layout options from current layout theme directory.
     *
     * @todo handle the view if there is no theme
     *
     * @return array
     */
    private function getLayoutOptions()
    {
        $theme = $this->container->get('system')->get('theme.active');
        $themesPath = $this->container->getParameter('themes_path');

        $layouts = [];
        if (is_dir($layoutPath = $themesPath.'/'.$theme.'/_tpl/layout')) {
            $files = (new Finder())->depth(0)
                ->in($layoutPath);
        } else {
            $files = [];
        }

        foreach ($files as $file) {
            $layouts[$file->getfilename()] = $file->getfilename();
        }

        return $layouts;
    }
}
