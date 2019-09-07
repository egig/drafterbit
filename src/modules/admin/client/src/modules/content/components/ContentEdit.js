import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Value } from "slate";
import actions from '../actions';
import Field from './Field';
import Editor from "./Unstructured/Editor"
import Notify from '../../../components/Notify';
import Card from '../../../components/Card/Card';
import { Row, Col } from 'reactstrap';
import  withDrafterbit from '../../../withDrafterbit';
const { FIELD_RICH_TEXT, FIELD_RELATION_TO_ONE,
    FIELD_RELATION_TO_MANY, FIELD_UNSTRUCTURED } = window.__DT_CONST;

import tinymce from 'tinymce/tinymce';
// A theme is also required
import 'tinymce/themes/silver/theme';

// Any plugins you want to use has to be imported
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';

// Initialize the app
tinymce.baseURL = "/tinymce/";
tinymce.init({
    selector: '#tiny',
    plugins: ['paste', 'link'],
});

// TODO move this to editor module
let initialValue = {
    "object": "value",
    "document": {
        "nodes": [
            {
                "object": "block",
                "type": "paragraph",
                "nodes": [
                    {
                        "object": "text"
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

class ContentEdit extends React.Component {

    constructor(props) {
        super(props);
        this.formData = {};
        this.state = {
            ctFields: [],
            entry: null,
            successText: '',
            formData: {}
        };
    }

    onSubmit() {
        let params = this.props.match.params;
        let contentId = params.content_id;
        let slug = params.content_type_slug;
        
        let data = {};
        this.state.ctFields.map(f => {
            data[f.name] = this.state.formData[f.name];

            if(parseInt(f.type_id) === parseInt(FIELD_UNSTRUCTURED)) {
                data[f.name] = slateValueToBlocks(this.state.formData[f.name])
            }
        });

        this.props.drafterbit.getApiClient().updateEntry(slug, contentId, data)
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

        this.props.drafterbit.getApiClient().getContentType(slug)
            .then(contentType => {
                this.setState({
                    ctFields: contentType.fields
                })
            });

        this.props.drafterbit.getApiClient().getEntry(slug, contentId)
            .then(entry => {
                this.setState({
                    formData: entry
                })
            });
    }

    componentDidUpdate(prevProps) {
        if(this.props.content !== prevProps.content) {
            console.log('updating content');
            this.props.content.fields.map(f => {
                this.formData[f.name] = f;
                this.setState({
                    formData: this.formData
                });

            });
        }
    }

    render() {
        return (
            <Fragment>
	            <Row>
		            <Col md="8">
			            <Card headerText="Edit Content" >
				            <form onSubmit={e => {
                                e.preventDefault();
                                this.onSubmit(e.target);
                            }} >
					            {this.state.ctFields.map((f,i) => {


						            let value = this.state.formData[f.name] ? this.state.formData[f.name] : '';

						            // CKEditor
						            if(parseInt(f.type_id) === parseInt(FIELD_RICH_TEXT)) {
							            return <Field value={value} onChange={(e) => {

							                this.setState(oldState => {
                                                let formData = oldState.formData;
                                                formData[f.name] = e.target.getContent();
                                                return Object.assign({}, oldState, {
                                                    formData
                                                });
                                            });

                                        }} key={i} field={f} />;
						            }

                                    if(parseInt(f.type_id) === parseInt(FIELD_RELATION_TO_ONE)){
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

                                    if(parseInt(f.type_id) === parseInt(FIELD_RELATION_TO_MANY)) {
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

                                    if(parseInt(f.type_id) === parseInt(FIELD_UNSTRUCTURED)) {

                                        let editorValue;
                                        let fValue = this.state.formData[f.name];
                                        if(!!fValue) {
                                            editorValue = Value.isValue(fValue) ? fValue : blocksToSlateValue(fValue);
                                        } else {
                                            editorValue = blocksToSlateValue(testInitValue);
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
					            })}

					            <div className="form-group">
						            <button type="submit" className="btn btn-success">Save</button>
					            </div>
				            </form>
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