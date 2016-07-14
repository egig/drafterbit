<?php

namespace drafterbit\Core\Widget;

use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\Form;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

abstract class Widget implements WidgetInterface
{
    /**
     * The Container.
     *
     * @var Container
     */
    protected $container;

    /**
     * Widget data.
     *
     * @var array
     */
    protected $context = [];

    /**
     * Run the widget.
     *
     * @return string
     */
    abstract public function run($context = null);

    /**
     * Get the widget name.
     *
     * @return string
     */
    abstract public function getName();

    /**
     * Get the widget name.
     *s.
     *
     * @return Form
     */
    abstract public function buildForm(Form $form);

    /**
     * Widget construction.
     *
     * @param WidgetUIBuilder $uiBuilder widget for build ui
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * Get contecxt type, mostly declared on each widget.
     *
     * @return array
     */
    public function getContextTypes()
    {
        return [];
    }

    /**
     * Get form view of the widget.
     *
     * @return FormView
     *
     * @todo clean this
     */
    public function getFormView($type, $data = null, $options = [])
    {
        $form = $this->container->get('form.factory')->create($type, $data, []);
        $options = [
            'attr' => ['class' => 'form-control input-sm'],
            'label_attr' => ['class' => 'control-label'],
            'mapped' => false,
        ];
        $form->add('title', TextType::class, $options);

        if ($data !== null) {
            $form->get('id')->setData($data->getId());
        }

        $form = $this->buildForm($form);

        $form->add('Save', SubmitType::class, ['attr' => ['class' => 'btn btn-primary btn-xs']]);

        return $form->createView();
    }

    /**
     * Set widget data.
     *
     * @param array $data
     */
    public function setContext($context)
    {
        $this->context = $context;
    }

    /**
     * Get Context.
     *
     * @return mixed
     */
    public function getContext($id = null)
    {
        if ($id) {
            return isset($this->context[$id]) ? $this->context[$id]  : null;
        }

        return $this->context;
    }

    /**
     * Determine if widget has a context.
     *
     * @return bool
     */
    public function hasContext($id)
    {
        return isset($this->context[$id]);
    }
}
