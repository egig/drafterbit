import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Value } from "slate";
import actions from '../actions';
import Field from './Field';
import Editor from "./Unstructured/Editor"
import Notify from '@drafterbit/common/client-side/components/Notify';
import { Row, Col, Card, Form, Button } from 'antd';
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
]

import { blocksToSlateValue, slateValueToBlocks } from "./Unstructured/contentTypeSerializer";
import ApiClient from '../ApiClient';

class ContentEdit extends React.Component {

    formRef = React.createRef();
    state = {
        ctFields: [],
        entry: null,
        successText: '',
        loading: true
    };

    componentDidMount() {
        let params = this.props.match.params;
        let contentId = params.content_id;
        let slug = params.content_type_slug;

        let client = this.props.drafterbit.getApiClient();
        Promise.all([
            client.getContentType(slug),
            client.getEntry(slug, contentId)
        ]).then(resList => {
            let [ contentType, entry ] = resList;
            let fields = contentType.fields;

            let formData = fields.reduce((formData, f) => {

                if(f.type_name === FieldType.UNSTRUCTURED) {
                    if (!(f.name in entry)) {
                        formData[f.name] = blocksToSlateValue(testInitValue);
                        return formData
                    } else {
                        formData[f.name] = blocksToSlateValue(entry[f.name])
                    }

                } else if(f.type_name === FieldType.RICH_TEXT) {

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
                ctFields: contentType.fields,
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

    renderUnstructured(f,i,value) {

        let editorValue = this.state.formData[f.name];
        if(!editorValue) {
            editorValue = blocksToSlateValue(richTextInitialValue);
        }

        return <div key={i} className="form-group">
            <label htmlFor={f.name}>{f.display_text}</label>
            <Editor
                value={editorValue}
                onChange={(change) => {

                    this.setState( oldState => {

                        let formData = oldState.formData;
                        formData[f.name] = change.value;
                        let res = Object.assign(oldState, {
                            formData
                        });

                        return  res;

                    });
                }}/>
        </div>;
    }

    onFinish = values => {

        let params = this.props.match.params;
        let contentId = params.content_id;
        let slug = params.content_type_slug;

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

        let client = this.props.drafterbit.getApiClient();
        client.updateEntry(slug, contentId, data)
            .then(r => {
                this.setState({
                    successText: 'Content successfully updated'
                });
            });

    };

    render() {
        return (
            <Fragment>
                {this.state.loading && <div>Loading&hellip;</div>}
                <Row>
                    <Col span="12" sm="24">
                        <Card title="Edit Content" >
                            <Form
                                ref={this.formRef}
                                layout="vertical"
                                onFinish={this.onFinish} >
                                {this.state.ctFields.map((f,i) => {
                                    if (!f.show_in_form) {
                                        return
                                    }

                                    if(f.type_name === FieldType.RICH_TEXT) {
                                        return this.renderRichText(f,i)
                                    }

                                    if(f.type_name === FieldType.UNSTRUCTURED) {
                                        return this.renderUnstructured(f,i,value)
                                    }

                                    if (FieldType.primitives().indexOf(f.type_name) !== -1) {
                                        return <Field key={i} field={f} />;
                                    }

                                    return this.renderRelation(f,i);
                                })}

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Save</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>

                {this.state.successText && <Notify type="success" message={this.state.successText} />}
            </Fragment>);
    }
}

const mapStateToProps = (state) => {
    return {
        content: state.CONTENT.content,
        contentTypeFields: state.CONTENT.ctFields.fields
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(ContentEdit));