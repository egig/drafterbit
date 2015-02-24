<?php namespace Drafterbit\System\Widget;

class WidgetUIBuilder
{

    /**
     * Build user interface for a widget
     *
     * @param Drafterbi\Widget\Widget $widget
     */
    public function build(Widget $widget)
    {
        $id            =  $widget->getContext('id');
        $title         =  $widget->getContext('title');
        $name          =  $widget->getName();
        $position      =  $widget->getContext('position');
        $theme         =  $widget->getContext('theme');
        
        $html  = form_open(admin_url('setting/themes/widget/save'), ['class' => 'widget-edit-form']);

        $html .= '<div class="form-group">'.$this->text('Title', 'title', $title).'</div>';
        $html .= $this->hidden('id', $id);
        $html .= $this->hidden('name', $name);
        $html .= $this->hidden('position', $position);
        $html .= $this->hidden('theme', $theme);

        $param = $widget->getContextTypes();

        if(!is_array($param)) {
            throw new \Exception(get_class($widget).'::getContextTypes must return an array');
        }

        foreach ($param as $config) {
            $html .= '<div class="form-group">';

            $name = $config['name'];
            $type = $config['type'];

            if ($widget->hasContext($name)) {
                $default = $widget->getContext($name);

            } else {
                $default = isset($config['default']) ? $config['default'] : null;
            }

            $options = isset($config['options']) ? $config['options'] : [];

            if (!method_exists($this, $type)) {
                throw new \RuntimeException("Type $type is not supported by Widget UI Builder");
            }

            $html .= empty($options) ?
                $this->$type($config['label'], "data[$name]", $default) :
                $this->$type($config['label'], "data[$name]", $default, $options);

            $html .= '</div>';
        }
        
        $html .= '<div class="clearfix" style="margin-top:10px;">';
        $html .= input_submit('save', 'Save', 'class="btn btn-primary btn-xs";');
        $html .= '<a href="javascript:;" data-id="'.$id.'" class="btn btn-xs dt-widget-remover">Remove</a>';
        $html .= '</div>';
        $html .= form_close();
        return $html;
    }

    /**
     * Create text input
     *
     * @param string $name
     * @param string $default
     */
    protected function text($label, $name, $default)
    {
        return label(ucfirst($label), $name).input_text($name, $default, 'class="form-control input-sm"');
    }

    protected function textarea($label, $name, $default)
    {
        return label(ucfirst($label), $name).input_textarea($name, $default, 'class="form-control input-sm"');
    }

    protected function select($label, $name, $options, $default)
    {
        return label(ucfirst($label), $name).input_select($name, $options, $default, 'class="form-control input-sm"');
    }

    protected function hidden($name, $default)
    {
        return input_hidden($name, $default);
    }
}
