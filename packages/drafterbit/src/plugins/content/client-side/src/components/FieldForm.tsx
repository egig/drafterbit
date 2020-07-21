import React, { useState, useContext, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Switch } from 'antd';
// @ts-ignore
import DTContext from '@drafterbit/common/client-side/DTContext';
import ClientSide from "../../../../admin/client-side/src/ClientSide";

declare namespace FieldForm {
    type Props = {
        onSuccess?: any,
        belongsToTypeName?: string,
        field?: any,
        types?: any
    }
}

const FieldForm = (props: FieldForm.Props) => {
    let {  onSuccess, belongsToTypeName, field, types } = props;
    let $dt: ClientSide = useContext(DTContext);
    let [form] = Form.useForm();

    const onSave = (values: any) => {

        let {type_name, name, label, multiple,
            show_in_form, show_in_list} = values;

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
                    }
                )
            } else {
                // create
                return $dt.getApiClient().addTypeField(belongsToTypeName,
                    type_name, name, label, multiple, show_in_list, show_in_form
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

    return (
        <Form
            form={form}
            layout="vertical"
            name="field_form"
            onFinish={onSave}
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
            <Form.Item valuePropName="checked" name="show_in_form" label="Show in Form">
                <Switch size="small" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Save</Button>
            </Form.Item>
        </Form>
    );
};

export = FieldForm