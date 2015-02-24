<?php

if (! function_exists('form_open')) {
    /**
 * Form Declaration
 *
 * Creates the opening portion of the form.
 *
 * @access public
 * @param  string    the URI segments of the form destination
 * @param  array    a key/value pair of attributes
 * @param  array    a key/value pair hidden data
 * @return string
 */

    function form_open($action = '', $attributes = '', $hidden = [])
    {
        if ($attributes == '') {
            $attributes = 'method="post"';
        }

        $form = '<form action="'.$action.'"';

        $form .= _join_attributes($attributes, true);

        $form .= '>';

        // @todo add CSRF protection

        if (is_array($hidden) and count($hidden) > 0) {
            $form .= sprintf("<div style=\"display:none\">%s</div>", form_hidden($hidden));
        }

        return $form;
    }
}


if (! function_exists('input_hidden')) {
    /**
 * Hidden Input Field
 *
 * Generates hidden fields.  You can pass a simple key/value string or an associative
 * array with multiple values.
 *
 * @access public
 * @param  mixed
 * @param  string
 * @return string
 */

    function input_hidden($name, $value = '')
    {
        $form = '';
        if (is_array($name)) {
            foreach ($name as $key => $val) {
                $form .= input_hidden($key, $val, true);
            }
            return $form;
        }

        if (! is_array($value)) {
            $form .= '<input type="hidden" name="'.$name.'" value="'._prepare_value($value, $name).'" />'."\n";
        } else {
            foreach ($value as $k => $v) {
                $k = (is_int($k)) ? '' : $k;
                $form .= form_hidden($name.'['.$k.']', $v, true);
            }
        }
        
        return $form;
    }
}

if (! function_exists('input_text')) {
    /**
 * Text Input Field
 *
 * @access public
 * @param  mixed
 * @param  string
 * @param  string
 * @return string
 */

    function input_text($data = '', $value = '', $extra = '')
    {
        $defaults = ['type' => 'text', 'name' => (( ! is_array($data)) ? $data : ''), 'value' => $value];

        return "<input "._parse_attributes($data, $defaults).$extra." />";
    }
}


if (! function_exists('input_password')) {
    /**
 * Password Field
 *
 * Identical to the input function but adds the "password" type
 *
 * @access public
 * @param  mixed
 * @param  string
 * @param  string
 * @return string
 */

    function input_password($data = '', $value = '', $extra = '')
    {
        if (! is_array($data)) {
            $data = ['name' => $data];
        }

        $data['type'] = 'password';
        return input_text($data, $value, $extra);
    }
}

if (! function_exists('input_file')) {
    /**
 * Upload Field
 *
 * Identical to the input function but adds the "file" type
 *
 * @access public
 * @param  mixed
 * @param  string
 * @param  string
 * @return string
 */

    function input_file($data = '', $value = '', $extra = '')
    {
        if (! is_array($data)) {
            $data = ['name' => $data];
        }

        $data['type'] = 'file';
        return form_input($data, $value, $extra);
    }
}

if (! function_exists('input_textarea')) {
    /**
 * Textarea field
 *
 * @access public
 * @param  mixed
 * @param  string
 * @param  string
 * @return string
 */

    function input_textarea($data = '', $value = '', $extra = '')
    {
        $defaults = ['name' => (( ! is_array($data)) ? $data : ''), 'cols' => '40', 'rows' => '10'];

        if (! is_array($data) or ! isset($data['value'])) {
            $val = $value;
        } else {
            $val = $data['value'];

            // textareas don't use the value attribute
            unset($data['value']);
        }

        $name = (is_array($data)) ? $data['name'] : $data;
        return "<textarea "._parse_attributes($data, $defaults).$extra.">"._prepare_value($val, $name)."</textarea>";
    }
}


if (! function_exists('input_multiselect')) {
    /**
 * Multi-select menu
 *
 * @access public
 * @param  string
 * @param  array
 * @param  mixed
 * @param  string
 * @return type
 */
    function input_multiselect($name = '', $options = [], $selected = [], $extra = '')
    {
        if (! strpos($extra, 'multiple')) {
            $extra .= ' multiple="multiple"';
        }

        return input_select($name, $options, $selected, $extra);
    }
}


if (! function_exists('input_select')) {
    /**
 * Drop-down Menu
 *
 * @access public
 * @param  string
 * @param  array
 * @param  string
 * @param  string
 * @return string
 */

    function input_select($name = '', $options = [], $selected = [], $extra = '')
    {
        if (! is_array($selected)) {
            $selected = [$selected];
        }

        if ($extra != '') {
            $extra = ' '.$extra;
        }

        $multiple = (count($selected) > 1 && strpos($extra, 'multiple') === false) ? ' multiple="multiple"' : '';

        $form = '<select name="'.$name.'"'.$extra.$multiple.">\n";

        foreach ($options as $key => $val) {
            $key = (string) $key;

            if (is_array($val) && ! empty($val)) {
                $form .= '<optgroup label="'.$key.'">'."\n";

                foreach ($val as $optgroup_key => $optgroup_val) {
                    $sel = (in_array($optgroup_key, $selected)) ? ' selected="selected"' : '';

                    $form .= '<option value="'.$optgroup_key.'"'.$sel.'>'.(string) $optgroup_val."</option>\n";
                }

                $form .= '</optgroup>'."\n";
            } else {
                $sel = (in_array($key, $selected)) ? ' selected="selected"' : '';

                $form .= '<option value="'.$key.'"'.$sel.'>'.(string) $val."</option>\n";
            }
        }

        $form .= '</select>';

        return $form;
    }
}

if (! function_exists('input_checkbox')) {
    /**
 * Checkbox Field
 *
 * @access public
 * @param  mixed
 * @param  string
 * @param  bool
 * @param  string
 * @return string
 */

    function input_checkbox($data = '', $value = '', $checked = false, $extra = '')
    {
        $defaults = ['type' => 'checkbox', 'name' => (( ! is_array($data)) ? $data : ''), 'value' => $value];

        if (is_array($data) and array_key_exists('checked', $data)) {
            $checked = $data['checked'];

            if ($checked == false) {
                unset($data['checked']);
            } else {
                $data['checked'] = 'checked';
            }
        }

        if ($checked == true) {
            $defaults['checked'] = 'checked';
        } else {
            unset($defaults['checked']);
        }

        return "<input "._parse_attributes($data, $defaults).$extra." />";
    }
}

if (! function_exists('input_radio')) {
    /**
 * Radio Button
 *
 * @access public
 * @param  mixed
 * @param  string
 * @param  bool
 * @param  string
 * @return string
 */

    function input_radio($data = '', $value = '', $checked = false, $extra = '')
    {
        if (! is_array($data)) {
            $data = ['name' => $data];
        }

        $data['type'] = 'radio';
        return input_checkbox($data, $value, $checked, $extra);
    }
}

if (! function_exists('input_submit')) {
    /**
 * Submit Button
 *
 * @access public
 * @param  mixed
 * @param  string
 * @param  string
 * @return string
 */

    function input_submit($data = '', $value = '', $extra = '')
    {
        $defaults = ['type' => 'submit', 'name' => (( ! is_array($data)) ? $data : ''), 'value' => $value];

        return "<input "._parse_attributes($data, $defaults).$extra." />";
    }
}

if (! function_exists('input_reset')) {
    /**
 * Reset Button
 *
 * @access public
 * @param  mixed
 * @param  string
 * @param  string
 * @return string
 */
    function input_reset($data = '', $value = '', $extra = '')
    {
        $defaults = ['type' => 'reset', 'name' => (( ! is_array($data)) ? $data : ''), 'value' => $value];

        return "<input "._parse_attributes($data, $defaults).$extra." />";
    }
}

if (! function_exists('input_button')) {
    /**
 * Form Button
 *
 * @access public
 * @param  mixed
 * @param  string
 * @param  string
 * @return string
 */
    function input_button($data = '', $content = '', $extra = '')
    {
        $defaults = ['name' => (( ! is_array($data)) ? $data : ''), 'type' => 'button'];

        if (is_array($data) and isset($data['content'])) {
            $content = $data['content'];

            // content is not an attribute
            unset($data['content']);
        }

        return "<button "._parse_attributes($data, $defaults).$extra.">".$content."</button>";
    }
}

if (! function_exists('label')) {
    /**
 * Form Label Tag
 *
 * @access public
 * @param  string    The text to appear onscreen
 * @param  string    The id the label applies to
 * @param  string    Additional attributes
 * @return string
 */

    function label($label_text = '', $id = '', $attributes = [])
    {

        $label = '<label';

        if ($id != '') {
            $label .= " for=\"$id\"";
        }

        if (is_array($attributes) and count($attributes) > 0) {
            foreach ($attributes as $key => $val) {
                $label .= ' '.$key.'="'.$val.'"';
            }
        }

        $label .= ">$label_text</label>";

        return $label;
    }
}

if (! function_exists('fieldset_open')) {
    /**
 * Fieldset Tag
 *
 * Used to produce <fieldset><legend>text</legend>.  To close fieldset
 * use form_fieldset_close()
 *
 * @access public
 * @param  string    The legend text
 * @param  string    Additional attributes
 * @return string
 */

    function fieldset_open($legend_text = '', $attributes = [])
    {
        $fieldset = "<fieldset";

        $fieldset .= _join_attributes($attributes, false);

        $fieldset .= ">\n";

        if ($legend_text != '') {
            $fieldset .= "<legend>$legend_text</legend>\n";
        }

        return $fieldset;
    }
}


if (! function_exists('fieldset_close')) {
    /**
 * Fieldset Close Tag
 *
 * @access public
 * @return string
 */

    function fieldset_close()
    {
        return "</fieldset>";
    }
}

if (! function_exists('form_close')) {
    /**
 * Form Close Tag
 *
 * @access public
 * @return string
 */

    function form_close()
    {
        return "</form>";
    }
}


if (! function_exists('_prepare_value')) {
    /**
 * Format text so it can be safely placed in a form field in case it has HTML tags.
 *
 * @access public
 * @param  string
 * @return string
 */

    function _prepare_value($str = '', $field_name = '')
    {
        static $prepped_fields = [];

        // if the field name is an array we do this recursively
        if (is_array($str)) {
            foreach ($str as $key => $val) {
                $str[$key] = _prepare_value($val);
            }

            return $str;
        }

        if ($str === '') {
            return '';
        }

        if (isset($prepped_fields[$field_name])) {
            return $str;
        }

        $str = htmlspecialchars($str);

        // In case htmlspecialchars misses these.
        $str = str_replace(["'", '"'], ["&#39;", "&quot;"], $str);

        if ($field_name != '') {
            $prepped_fields[$field_name] = $field_name;
        }

        return $str;
    }
}


if (! function_exists('_parse_attributes')) {
    /**
 * Parse the form attributes
 *
 * Helper function used by some of the form helpers
 *
 * @access private
 * @param  array
 * @param  array
 * @return string
 */

    function _parse_attributes($attributes, $default)
    {
        if (is_array($attributes)) {
            foreach ($default as $key => $val) {
                if (isset($attributes[$key])) {
                    $default[$key] = $attributes[$key];
                    unset($attributes[$key]);
                }
            }

            if (count($attributes) > 0) {
                $default = array_merge($default, $attributes);
            }
        }

        $att = '';

        foreach ($default as $key => $val) {
            if ($key == 'value') {
                $val = _prepare_value($val, $default['name']);
            }

            $att .= $key . '="' . $val . '" ';
        }

        return $att;
    }
}

if (! function_exists('_join_attributes')) {
    /**
 * Attributes To String
 *
 * Helper function used by some of the form helpers
 *
 * @access private
 * @param  mixed
 * @param  bool
 * @return string
 */
    function _join_attributes($attributes, $formtag = false)
    {
        if (is_object($attributes) and count($attributes) > 0) {
            $attributes = (array)$attributes;
        }

        if (is_array($attributes) and count($attributes) > 0) {
            $atts = '';

            if (! isset($attributes['method']) and $formtag === true) {
                $atts .= ' method="post"';
            }

            foreach ($attributes as $key => $val) {
                $atts .= ' '.$key.'="'.$val.'"';
            }

            return $atts;
        }
    }
}

if (! function_exists('value')) {
    /**
     * Get input value
     *
     * @param  string $name
     * @param  mixed  $value
     * @return void
     */
    function value($name, $default = null)
    {
        return app('input')->get($name, $default);
    }
}

if (! function_exists('set_option')) {
    /**
     * Set the option to current selected or checked
     *
     * @param  string $name
     * @param  string $type
     * @param  mixed  $value
     * @param  mixed  $default
     * @return void
     */
    function set_option($name, $type = "selected", $value = null, $default = false)
    {
        if ($default) {
            return $type.'="'.$type.'"';
        }

        $post = app('input')->get($name);

        if (is_null($post)) {
            return null;
        }

        if (is_array($post)) {
            return in_array($value, $post) ? $type : null;
        }

        return ($value == $post) ? $type : null;
    }
}

if (! function_exists('checked')) {
    /**
     * Set input checked
     *
     * @param  string $name
     * @param  mixed  $value
     * @param  mixed  $default
     * @return void
     */
    function checked($name, $value = null, $default = false)
    {
        return set_option($name, 'checked', $value, $default);
    }
}

if (! function_exists('selected')) {
    /**
     * Set options selected
     *
     * @param  string $name
     * @param  mixed  $value
     * @param  mixed  $default
     * @return void
     */
    function selected($name, $value = null, $default = false)
    {
        return set_option($name, 'selected', $value, $default);
    }
}

if (! function_exists('hide')) {
    /**
     * Hide a form section based in value
     *
     * @param  string $name
     * @param  mixed  $value
     * @param  mixed  $default
     * @return void
     */
    function hide($name, $value = null, $default = false)
    {
        if ($default) {
            return 'display:block';
        }
        
        return 'display:none';
    }
}
