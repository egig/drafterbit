import React from 'react';
import RichText from './RichText';
import Relation  from './Relation';
import { Form, Input, InputNumber } from 'antd'
import FieldType from '@drafterbit/common/dist/FieldType';


type Props = {
    field: any,
    value?: any,
    onChange?: any,
}

// TODO import multiple primitive ?
class Field extends React.Component<Props, {}> {

    render() {

        let { field, value, onChange } = this.props;
         let types = {
            [FieldType.SHORT_TEXT]: () => (
                <Input onChange={onChange}/>
            ),
            [FieldType.LONG_TEXT]: () => (
                <Input.TextArea  onChange={onChange}/>
            ),
            [FieldType.RICH_TEXT]: () => (
                <RichText initialValue={value} onChange={onChange}/>
            ),
            [FieldType.NUMBER]: () => (
                <InputNumber style={{width:"100%"}} onChange={onChange} name={field.name} />
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

export = Field;