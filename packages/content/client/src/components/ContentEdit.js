import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Value } from "slate";
import actions from '../actions';
import Field from './Field';
import Editor from "./Unstructured/Editor"
import Notify from '../../../../core/client/src/components/Notify';
import Card from '../../../../core/client/src/components/Card/Card';
import { Row, Col } from 'reactstrap';
import withDrafterbit from '../../../../core/client/src/withDrafterbit';
const FieldType = require('@drafterbit/drafterbit/FieldType');

import htmlSerializer from './Unstructured/htmlSerializer';

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

    constructor(props) {
        super(props);
        this.formData = {};
        this.state = {
            ctFields: [],
            entry: null,
            successText: '',
            formData: {},
            loading: true
        };
    }

    onSubmit() {
        let params = this.props.match.params;
        let contentId = params.content_id;
        let slug = params.content_type_slug;
        
        let data = {};
        this.state.ctFields.map(f => {
            data[f.name] = this.state.formData[f.name];

            if(parseInt(f.type_id) === FieldType.UNSTRUCTURED) {
                data[f.name] = slateValueToBlocks(this.state.formData[f.name])
            }

            if(parseInt(f.type_id) === FieldType.RICH_TEXT) {
                data[f.name] = htmlSerializer.serialize(this.state.formData[f.name])
            }
        });

        let client = new ApiClient(this.props.drafterbit.getAxiosInstance());
        client.updateEntry(slug, contentId, data)
            .then(r => {
                this.setState({
                    successText: 'Content successfully updated'
                });
            });
    }

    componentDidMount() {
        let params = this.props.match.params;
        let contentId = params.content_id;
        let slug = params.content_type_slug;

        let client = new ApiClient(this.props.drafterbit.getAxiosInstance());
        Promise.all([
            client.getContentType(slug),
            client.getEntry(slug, contentId)
        ]).then(resList => {
            let [ contentType, entry ] = resList;
            let fields = contentType.fields;

            let formData = fields.reduce((formData, f) => {

                if(parseInt(f.type_id) === FieldType.UNSTRUCTURED) {
                    if (!(f.name in entry)) {
                        formData[f.name] = blocksToSlateValue(testInitValue);
                        return formData
                    } else {
                        formData[f.name] = blocksToSlateValue(entry[f.name])
                    }

                } else if(parseInt(f.type_id) === FieldType.RICH_TEXT) {

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

            this.setState({
                ctFields: contentType.fields,
                formData: formData,
                loading: false
            });

        });
    }

    componentDidUpdate(prevProps) {
        if(this.props.content !== prevProps.content) {
            this.props.content.fields.map(f => {
                this.formData[f.name] = f;
                this.setState({
                    formData: this.formData
                });

            });
        }
    }

    renderRichText(f,i,value) {

        let editorValue = this.state.formData[f.name];
        if(!editorValue) {
            editorValue = Value.fromJSON(richTextInitialValue);
        }

        return <Field value={editorValue} onChange={(value) => {

            this.setState(oldState => {
                let formData = oldState.formData;
                formData[f.name] = value;
                return Object.assign({}, oldState, {
                    formData
                });
            });

        }} key={i} field={f} />;
    }

    renderRelationToOne(f,i,value) {
        return <Field value={value} onChange={(selected, actionsContainer) => {

            this.setState(oldState => {

                let formData = oldState.formData;
                formData[f.name] = selected.value;
                return Object.assign({}, oldState, {
                    formData
                });

            });


        }} key={i} field={f} />;
    }

    renderRelationToMany(f,i,value) {
        return <Field value={value} onChange={(selectedList, actionsContainer) => {

            selectedList = selectedList || [];

            this.setState(oldState => {

                let formData = oldState.formData;
                formData[f.name] =  selectedList.map(s => s.value);
                return Object.assign({}, oldState, {
                    formData
                });

            });


        }} key={i} field={f} />;
    }

    renderUnstructured(f,i,value) {

        let editorValue = this.state.formData[f.name];
        if(!editorValue) {
            editorValue = blocksToSlateValue(richTextInitialValue);
        }

        return <div key={i} className="form-group">
            <label htmlFor={f.name}>{f.label}</label>
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

    renderCommonField(f,i,value) {
        return <Field value={value} onChange={e => {

            let value = e.target.value;

            this.setState(oldState => {

                let formData = oldState.formData;
                formData[f.name] = value;
                return Object.assign({}, oldState, {
                    formData
                });

            });


        }} key={i} field={f} />;
    }

    render() {
        return (
            <Fragment>
                {this.state.loading && <div>Loading&hellip;</div>}
                {this.state.loading ||
                    <Row>
                        <Col md="8">
                            <Card headerText="Edit Content" >
                                <form onSubmit={e => {
                                    e.preventDefault();
                                    this.onSubmit(e.target);
                                }} >
                                    {this.state.ctFields.map((f,i) => {
                                        if (!f.show_in_form) {
                                            return
                                        }

                                        let value = this.state.formData[f.name] ? this.state.formData[f.name] : '';

                                        if(parseInt(f.type_id) === FieldType.RICH_TEXT) {
                                            return this.renderRichText(f,i,value)
                                        }

                                        if(parseInt(f.type_id) === FieldType.RELATION_TO_ONE){
                                            return this.renderRelationToOne(f,i,value)
                                        }

                                        if(parseInt(f.type_id) === FieldType.RELATION_TO_MANY) {
                                            return this.renderRelationToMany(f,i,value)
                                        }

                                        if(parseInt(f.type_id) === FieldType.UNSTRUCTURED) {
                                            return this.renderUnstructured(f,i,value)
                                        }

                                        return this.renderCommonField(f,i,value)
                                    })}

                                    <div className="form-group">
                                        <button type="submit" className="btn btn-success">Save</button>
                                    </div>
                                </form>
                            </Card>
                        </Col>
                    </Row>
                }
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