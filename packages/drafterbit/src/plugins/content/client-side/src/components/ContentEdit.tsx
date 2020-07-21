import React  from 'react';
import Field from './Field';
import { Row, Col, Card, Form, Button, message, PageHeader, Select } from 'antd';
// @ts-ignore
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
import styled from 'styled-components';
import ClientSide from "../../../../admin/client-side/src/ClientSide";

const FieldType = require('@drafterbit/common/FieldType');


const CardWrapper = styled.div`
    padding: 0 0 0 15px;
`;

// TODO move this to editor module
let richTextInitialValue = [
    {
        type: 'paragraph',
        children: [{ text: 'A line of text in a paragraph.' }],
    },
]

let testInitValue = [
    {
        type: "paragraph",
        html_text: "<p></p>"
    }
];

type Props = {
    $dt: ClientSide,
    match: any,
    history: any
}

type State = {
    ctFields: any[],
    loading: boolean
}

class ContentEdit extends React.Component<Props, State> {

    formRef: React.RefObject<any> = React.createRef();
    state = {
        ctFields: [],
        loading: false
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

            this.formRef.current.setFieldsValue(entry);

            this.setState({
                ctFields: type.fields,
                loading: false
            });

        });
    }

    renderRichText(f: any,i: number) {

        let editorValue = this.formRef.current.getFieldValue(f.name);

        return <Field value={editorValue} onChange={(value: any) => {
            this.formRef.current.setFieldsValue({
                [f.name]: value
            })

        }} key={i} field={f} />;
    }

    renderRelation(f: any,i: number) {
        return <Field key={i} field={f} />;
    }

    onFinish = (values: any) => {

        let params = this.props.match.params;
        let contentId = params.content_id;
        let typeName = params.type_name;

        let data: any = {};
        this.state.ctFields.map((f: any) => {
            data[f.name] = values[f.name];
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
            <Form
                ref={this.formRef}
                layout="vertical"
                initialValues={{
                    status: "draft"
                }}
                onFinish={this.onFinish} >
                <PageHeader
                    // onBack={() => window.history.back()}
                    title="Edit Entry"
                    // subTitle="This is a subtitle"
                    extra={[ <Button key="save" type="primary" htmlType="submit">Save</Button>]}
                >
                    <Row>
                        <Col span={16}>
                            <Card>
                                {this.state.ctFields.map((f: any,i: number) => {
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
                        </Col>
                        <Col span={8}>
                            <CardWrapper>
                                <Card>
                                    <Form.Item label="Status" name="status">
                                        <Select >
                                            <Select.Option value="">Select Status</Select.Option>
                                            <Select.Option value="draft">Draft</Select.Option>
                                            <Select.Option value="published">Published</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Card>
                            </CardWrapper>
                        </Col>
                    </Row>
                </PageHeader>
            </Form>
            </>);
    }
}

export default withDrafterbit(ContentEdit);