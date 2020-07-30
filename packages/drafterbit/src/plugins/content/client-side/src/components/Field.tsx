import React from 'react';
import RichText from './RichText';
import Relation  from './Relation';
import { Form, Input, InputNumber } from 'antd'
import { FieldType } from '@drafterbit/common';

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
                    label={field.label}
                    name={field.name}
                    rules={[
                        (form) => ({
                            async validator(rule, value) {

                                let rules = field.validation_rules;
                                Object.keys(rules).map(k => {
                                    if (k === "required") {
                                        if (!!rules[k]) {
                                            if (!!value && value !== "") {
                                                throw new Error(`${field.label} is required`);
                                            }
                                        }
                                    }

                                    if (k === "max_length") {
                                        let maxL = rules[k];
                                        if (value.length > maxL) {
                                            throw new Error(`${field.label} is too long`);
                                        }
                                    }

                                    if (k === "min_length") {
                                        let minL = rules[k];
                                        if (value.length < minL) {
                                            throw new Error(`${field.label} is too short`);
                                        }
                                    }

                                    if (k === "max") {
                                        let max = rules[k];
                                        if (value > max) {
                                            throw new Error(`${field.label} can not be more than ${max}`);
                                        }
                                    }

                                    if (k === "min") {
                                        let min = rules[k];
                                        if (value < min) {
                                            throw new Error(`${field.label} can not be less than ${min}`);
                                        }
                                    }

                                });
                                return Promise.resolve();
                            },
                        })
                    ]}
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