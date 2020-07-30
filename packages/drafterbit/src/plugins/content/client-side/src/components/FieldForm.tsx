import React, { useState, useContext, useEffect } from 'react';
import { Button, Modal, Form, Input, InputNumber, Select, Switch } from 'antd';
// @ts-ignore
import DTContext from '@drafterbit/common/dist/client-side/DTContext';
import { FieldType } from "@drafterbit/common";
import ClientSide from "../../../../admin/client-side/src/ClientSide";
import type = Mocha.utils.type;

declare namespace FieldForm {
    type Props = {
        onSuccess?: any,
        belongsToTypeName: string,
        field?: any,
        types?: any
    }
}

const FieldForm = (props: FieldForm.Props) => {
    let {  onSuccess, belongsToTypeName, field, types } = props;
    let $dt: ClientSide = useContext(DTContext);
    let [form] = Form.useForm();

    const onSave = (values: any) => {

        // TODO save validation_rules
        let {type_name, name, label, multiple,
            show_in_form, show_in_list, validation_rules} = values;

        (() => {
            if(!!field) {
                return $dt.getApiClient().updateTypeField(
                    belongsToTypeName,
                    field._id,
                    {
                        type_name,
                        name,
                        label,
                        multiple,
                        show_in_form,
                        show_in_list,
                        validation_rules
                    }
                )
            } else {
                // create
                return $dt.getApiClient().addTypeField(belongsToTypeName,
                    type_name, name, label, multiple, show_in_list, show_in_form, validation_rules
                )
                    .then(()=> {
                        form.resetFields();
                    })
            }

        })()
            .then(onSuccess);
    };

    let initialValues = {
        multiple: false,
        show_in_list: true,
        show_in_form: true,
        name: "",
        type_name: "",
        label: ""
    };
    if (!!field) {
        initialValues =  field;
    }

    let dvo = !!field ? FieldType.get(field.type_name).validationOptions : [];
    let [validationOptions, setValidationOptions] = React.useState(dvo);

    const onValuesChange = function (changedValues: any, allValues: any) {
        let typeName = form.getFieldValue("type_name");
        if (!!typeName) {
            setValidationOptions(FieldType.get(typeName).validationOptions);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            name="field_form"
            onFinish={onSave}
            onValuesChange={onValuesChange}
            initialValues={initialValues}>
            <Form.Item
                name="type_name"
                label="Type"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Select
                    showSearch
                    placeholder="Select type"
                    optionFilterProp="children"
                    // filterOption={(input: any, option: any) => {
                    //     if (typeof option.children != "undefined") {
                    //         return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    //     }
                    // }}
                >{types.map((t: any,i:number) => {
                    return <Select.Option key={i} value={t.name}>{t.display_text}</Select.Option>
                })}
                </Select>
            </Form.Item>

            <Form.Item
                name="name"
                label="Name"
                rules={[
                    {
                        required: true,
                        message: 'Name Required !',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="label"
                label="Label"
                rules={[
                    {
                        required: true,
                        message: 'Display Text Required !',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item valuePropName="checked" name="multiple" label="Multiple">
                <Switch size="small" />
            </Form.Item>
            <Form.Item valuePropName="checked" name="show_in_list" label="Show in List">
                <Switch size="small" />
            </Form.Item>
            {validationOptions.map((v: any,i: number) => {

                if (v == "required") {
                    return (
                        <Form.Item valuePropName="checked" name={["validation_rules","required"]} label="Required">
                            <Switch size="small" />
                        </Form.Item>
                    )
                }

                if (v == "unique") {
                    return (
                        <Form.Item valuePropName="checked" name={["validation_rules","unique"]} label="Unique">
                            <Switch size="small" />
                        </Form.Item>
                    )
                }

                if (v == "max_length") {
                    return (
                        <Form.Item name={["validation_rules","max_length"]} label="Max Length">
                            <InputNumber />
                        </Form.Item>
                    )
                }

                if (v == "min_length") {
                    return (
                        <Form.Item name={["validation_rules","min_length"]} label="Min Length">
                            <InputNumber />
                        </Form.Item>
                    )
                }

                if (v == "max") {
                    return (
                        <Form.Item name={["validation_rules","max"]} label="Max">
                            <InputNumber />
                        </Form.Item>
                    )
                }

                if (v == "min") {
                    return (
                        <Form.Item name={["validation_rules","min"]} label="Min">
                            <InputNumber />
                        </Form.Item>
                    )
                }
            })}
            <Form.Item>
                <Button type="primary" htmlType="submit">Save</Button>
            </Form.Item>

        </Form>
    );
};

export = FieldForm