import React  from 'react';
import { Value } from "slate";
import Field from './Field';
import { Row, Col, Card, Form, Button, message, PageHeader } from 'antd';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
import htmlSerializer from './Unstructured/htmlSerializer';

const FieldType = require('@drafterbit/common/FieldType');

// TODO move this to editor module
let richTextInitialValue = {
    "object": "value",
    "document": {
        "object": "document",
        "nodes": [
            {
                "object": "block",
                "type": "paragraph",
                "nodes": [
                    {
                        "object": "text",
                        "text": ""
                    }
                ]
            }
        ]
    }
}

let testInitValue = [
    {
        type: "paragraph",
        html_text: "<p></p"
    }
];

class ContentEdit extends React.Component {

    formRef = React.createRef();
    state = {
        ctFields: [],
    };

    componentDidMount() {
        let params = this.props.match.params;
        let contentId = params.content_id;
        let typeName = params.type_name;

        let client = this.props.$dt.getApiClient();
        Promise.all([
            client.getType(typeName),
            client.getEntry(typeName, contentId)
        ]).then(resList => {
            let [ type, entry ] = resList;
            let fields = type.fields;

            let formData = fields.reduce((formData, f) => {
                if(f.type_name === FieldType.RICH_TEXT) {

                    if (!(f.name in entry)) {
                        formData[f.name] = Value.fromJSON(richTextInitialValue)
                        return formData
                    } else {
                        formData[f.name] = htmlSerializer.deserialize(entry[f.name])
                    }

                } else {
                    if (!(f.name in entry)) {
                        formData[f.name] = "";
                    } else {
                        formData[f.name] = entry[f.name]
                    }
                }

                return formData;
            }, {});

            this.formRef.current.setFieldsValue(formData);

            this.setState({
                ctFields: type.fields,
                loading: false
            });

        });
    }

    renderRichText(f,i,value) {

        let editorValue = this.formRef.current.getFieldValue[f.name];
        if(!editorValue) {
            editorValue = Value.fromJSON(richTextInitialValue);
        }

        return <Field value={editorValue} onChange={(value) => {
            this.formRef.current.setFieldsValue({
                [f.name]: value
            })

        }} key={i} field={f} />;
    }

    renderRelation(f,i) {
        return <Field key={i} field={f} />;
    }

    onFinish = values => {

        let params = this.props.match.params;
        let contentId = params.content_id;
        let typeName = params.type_name;

        let data = {};
        this.state.ctFields.map(f => {
            data[f.name] = values[f.name];

            if(f.type_name === FieldType.UNSTRUCTURED) {
                data[f.name] = slateValueToBlocks(values[f.name])
            }

            if(f.type_name === FieldType.RICH_TEXT) {
                data[f.name] = htmlSerializer.serialize(values[f.name])
            }
        });

        let client = this.props.$dt.getApiClient();
        client.updateEntry(typeName, contentId, data)
            .then(() => {
                message.success('Content successfully updated')
            });

    };

    render() {
        return (
            <>
                <Row>
                    <Col span="24">
                        <Form
                            ref={this.formRef}
                            layout="vertical"
                            onFinish={this.onFinish} >
                            <PageHeader
                                // onBack={() => window.history.back()}
                                title="Edit Entry"
                                // subTitle="This is a subtitle"
                                extra={[ <Button type="primary" htmlType="submit">Save</Button>]}
                            >
                                <Card>
                                        {this.state.ctFields.map((f,i) => {
                                            if (!f.show_in_form) {
                                                return
                                            }

                                            if(f.type_name === FieldType.RICH_TEXT) {
                                                return this.renderRichText(f,i)
                                            }

                                            if (FieldType.primitives().indexOf(f.type_name) !== -1) {
                                                return <Field key={i} field={f} />;
                                            }

                                            return this.renderRelation(f,i);
                                        })}
                                </Card>
                            </PageHeader>
                        </Form>
                    </Col>
                </Row>
            </>);
    }
}

export default withDrafterbit(ContentEdit);