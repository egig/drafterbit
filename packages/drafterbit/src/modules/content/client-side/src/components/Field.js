import React from 'react';
import RichText from './RichText';
import Relation  from './Relation';
import { Form, Input } from 'antd'

const FieldType = require('@drafterbit/common/FieldType');


// TODO import multiple primitive ?
class Field extends React.Component {

    render() {
        let field = this.props.field;
        let value = this.props.value;
        let types = {
            [FieldType.SHORT_TEXT]: () => (
                <Input onChange={this.props.onChange}/>
            ),
            [FieldType.LONG_TEXT]: () => (
                <Input.TextArea value={value} onChange={this.props.onChange}/>
            ),
            [FieldType.RICH_TEXT]: () => (
                <RichText initialValue={value} value={value}  onChange={this.props.onChange}/>
            ),
            [FieldType.NUMBER]: () => (
                <Input value={value} onChange={this.props.onChange} name={field.name} type="number"/>
            )
        };

        if (FieldType.primitives().indexOf(field.type_name) !== -1) {
            return (
                <Form.Item
                    label={field.display_text}
                    name={field.name}
                >
                    {/*<label htmlFor={field.name}>{field.display_text}</label>*/}
                    {types[field.type_name]()}
                </Form.Item>
            );
        } else {
            return (
                <Form.Item
                    label={field.display_text}
                    name={field.name}
                >
                    <Relation multiple={field.multiple}
                              typeName={field.type_name}
                              onChange={this.props.onChange}
                              value={value ? value : []}/>
                </Form.Item>
            )
        }
    }
}

export default Field;