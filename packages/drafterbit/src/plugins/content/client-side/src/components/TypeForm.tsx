import React, { useContext } from 'react';
import { Modal, Form, Input, Switch } from 'antd';
// @ts-ignore
import DTContext from '@drafterbit/common/client-side/DTContext';
import ClientSide from "../../../../admin/client-side/src/ClientSide";

declare namespace TypeForm {
    type Props = {
        visible?: boolean,
        typeId?: string,
        name?: string,
        slug?: string,
        displayText?: string,
        description?: string,
        has_fields?: boolean,
        onCancel?: any,
        onSuccess?: any,
    }
}

const TypeForm = (props: TypeForm.Props) => {

    let {
        visible, typeId, name, slug, displayText,
        description, has_fields, onCancel, onSuccess } = props;

    const [form] = Form.useForm();
    let $dt:ClientSide = useContext(DTContext);

    const onSave = (values: any) => {
        let { name, slug, display_text, has_fields, description } = values;

        (() => {
            if(!!typeId) {
                return $dt.getApiClient().updateType(typeId, {
                    name,
                    slug,
                    display_text,
                    has_fields,
                    description
                })
                    .then(() => {
                        return {
                            _id: typeId,
                            name,
                            slug,
                            has_fields,
                            description
                        }
                    })
            } else {
                return $dt.getApiClient().createType(name, slug, display_text, description, has_fields)
            }
        })()
            .then((type: any) => {
                onSuccess(type);
            });
    };

    return (
        <Modal
            visible={visible}
            title="Create a new Type"
            okText="Save"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        form.resetFields();
                        onSave(values);
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="type_form"
                initialValues={{
                    name,
                    slug,
                    display_text: displayText,
                    description,
                    has_fields
                }}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: 'Name is Required!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="slug"
                    label="Slug"
                    rules={[
                        {
                            required: true,
                            message: 'Slug is Required!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="display_text"
                    label="Display Text"
                    rules={[
                        {
                            required: true,
                            message: 'Name is Required!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item valuePropName="checked" name="has_fields" label="Has Fields">
                    <Switch size="small" />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input.TextArea/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TypeForm