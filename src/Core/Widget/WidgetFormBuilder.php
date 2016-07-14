<?php

namespace drafterbit\Core\Widget;

use Symfony\Component\Form\FormView;
use Symfony\Component\DependencyInjection\Container;
use drafterbit\Bundle\CoreBundle\Form\Type\WidgetType;

class WidgetFormBuilder
{
    private $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    public function build(Widget $widget, $data = null, $options = [])
    {
        $id = $data->getId();

        $html = '';

        $context = $widget->getContext();

        $form = $widget->getFormView(WidgetType::class, $data, $options);

        $saveUrl = $this->container->get('router')->generate('dt_setting_widget_save');

        if ($form instanceof FormView) {
            $helper = $this->container->get('templating.helper.form');
            $html .= $helper->start($form, ['attr' => ['class' => 'widget-edit-form'], 'action' => $saveUrl]);

            foreach ($form as $key => $val) {
                if (isset($context[$key])) {
                    $value = $context[$key];
                } else {
                    $value = null;
                }

                // @todo find a way to check a form type is hidden or not
                if (!in_array($key, ['Save', '_token', 'id', 'name', 'theme', 'position'])) {
                    $html .= '<div class="form-group">';
                    $html .= $helper->label($form[$key], null, ['label_attr' => ['class' => 'control-label']]);
                    $html .= $helper->widget($form[$key], ['attr' => ['class' => 'form-control input-sm'], 'value' => $value]);
                    $html .= '</div>';
                }
            }

            $html .= '<div class="clearfix" style="margin-top:10px;">';
            $html .= $helper->widget($form['Save']);
            $html .= '<a href="javascript:;" data-id="'.$id.'" class="btn btn-xs dt-widget-remover">Remove</a>';
            $html .= '</div>';

            $html .= $helper->end($form);
        }

        return $html;
    }
}
