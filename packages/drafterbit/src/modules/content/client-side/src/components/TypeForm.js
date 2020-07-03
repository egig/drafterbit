import React, { useContext } from 'react';
import { Modal, Form, Input } from 'antd';
import DTContext from '@drafterbit/common/client-side/DTContext';

const TypeForm = ({ visible, typeId, name, slug, displayText,
    description, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    let $dt = useContext(DTContext);

    const onSave = (values) => {
        let { name, slug, display_text, description } = values;

        (() => {
            if(!!typeId) {
                return $dt.getApiClient().updateType(typeId, {
                    name,
                    slug,
                    display_text,
                    description
                })
                    .then(() => {
                        return {
                            _id: typeId,
                            name,
                            slug,
                            description
                        }
                    })
            } else {
                return $dt.getApiClient().createType(name, slug, display_text,description)
            }
        })()
            .then(contentType => {
                onSuccess(contentType);
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
                    description
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
                <Form.Item name="description" label="Description">
                    <Input.TextArea/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TypeForm