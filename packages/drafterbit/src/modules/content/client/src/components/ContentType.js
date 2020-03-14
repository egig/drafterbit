import React, { Fragment } from 'react';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Notify from '@drafterbit/common/client/components/Notify';
import Card from '@drafterbit/common/client/components/Card/Card';
import { Button, Row, Col } from 'reactstrap';
import FieldForm from './FieldForm';
import withDrafterbit from '@drafterbit/common/client/withDrafterbit';
import ContentTypeForm from './ContentTypeForm'
import ApiClient from '../ApiClient';

const FieldType  = require('@drafterbit/common/FieldType');

class ContentType extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            _id: '',
            name: '',
            slug: '',
            description: '',
            fields: [],
            notifyText: '',
	        fieldDialogActive: false,
	        editedFieldId: "",
            fieldTypeSelected: null,
            basicEditForm: false,
            loading: true
        };

        this.deleteField = this.deleteField.bind(this);
        this.doUpdate = this.doUpdate.bind(this);
        this.fetchContentType = this.fetchContentType.bind(this);
    }

    fetchContentType() {
        let client = new ApiClient(this.props.drafterbit.getAxiosInstance());
        return client.getContentType(this.props.match.params.content_type_id)
            .then(contentType => {

                this.setState({
                    _id: contentType._id,
                    name: contentType.name,
                    slug: contentType.slug,
                    description: contentType.description,
                    fields: contentType.fields,
                    loading: false
                });
            });
    }

    componentDidMount() {
        this.fetchContentType()
    }

    deleteField(f) {
    	let newFields = this.state.fields.filter((sf) => {
		    return (sf._id !== f._id);
	    });

	    this.setState({
		    fields: newFields,
	    }, this.doUpdate);
    }

    deleteContentType(deleteForm) {
        // TODO create alert
        let client = new ApiClient(this.props.drafterbit.getAxiosInstance());
        client.deleteContentType(deleteForm.id.value)
            .then(r => {
                // TODO create success notif
                this.props.history.push('/content_types');
            });
    }

    doUpdate() {
        let client = new ApiClient(this.props.drafterbit.getAxiosInstance());
        client.updateContentType(
            this.state._id,
            this.state.name,
            this.state.slug,
            this.state.description,
            this.state.fields
        ).then(r => {
            this.setState({
                notifyText: 'Content type successfully saved.'
            });
        });
    }

    render() {

        return (
            <Fragment>
                {this.state.loading && <div>Loading&hellip;</div>}
                {this.state.loading ||
                <Row>
                    <Col md="12" className="mb-3">
                        <h2>{this.state.name} <small className="text-muted"><a href="/" onClick={e => {
                            e.preventDefault();
                            this.setState({
                                basicEditForm: true
                            })
                        }}><i className="icon-note"/></a></small></h2>
                        <small>{this.state.description}</small>
                        <div className="mb-3"/>
                    </Col>
                    <Col md="12">
                        <Card headerText="Fields">
                            <button onClick={e => {
                                e.preventDefault();
                                this.setState({
                                    fieldDialogActive: true,
                                    editedFieldId: ""
                                });
                            }} className="btn btn-success btn-sm mb-2">Add Field
                            </button>
                            <table className="table table-sm table-bordered">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Label</th>
                                    <th>Type</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.fields.map((f, i) => {
                                    return (
                                        <tr key={i}>
                                            <td><a href="#" onClick={e => {
                                                e.preventDefault();

                                                this.setState({
                                                    fieldDialogActive: true,
                                                    editedFieldId: f._id
                                                })
                                            }}>{f.name}</a></td>
                                            <td>{f.label}</td>
                                            <td>{FieldType.get(f.type_id).name}</td>
                                            <td><Button size="sm" onClick={e => {
                                                this.deleteField(f);
                                            }}>&times;</Button></td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </Card>
                        <div className="mb-3"/>
                        <Card headerText={`Delete Content Type : ${this.state.name}`}>
                            <form onSubmit={e => {
                                e.preventDefault();
                                this.deleteContentType(e.target);
                            }}>
                                <input type="hidden" name="id" id="id" value={this.state._id}/>
                                <button type="submit" className="btn btn-danger">Delete Content Type</button>
                            </form>
                        </Card>
                    </Col>
                </Row>
                }
                <FieldForm
                    isOpen={this.state.fieldDialogActive}
                    contentTypeId={this.state._id}
                    fieldId={this.state.editedFieldId}
                    onCancel={e => {
                        e.preventDefault();
                        this.setState({
                            fieldDialogActive: false,
                            editedFieldId: ""
                        });
                    }}
                    onSuccess={e => {
                        this.fetchContentType()
                            .then(() => {
                                this.setState({
                                    fieldDialogActive: false,
                                    editedFieldId: ""
                                });
                            })
                    }}
                />
                {this.state.notifyText &&
                  <Notify type="success" message={this.state.notifyText} />
                }
                <ContentTypeForm
                    isOpen={this.state.basicEditForm}
                    contentTypeId={this.state._id}
                    name={this.state.name}
                    slug={this.state.slug}
                    description={this.state.description}
                    onCancel={e => {
                        this.setState({
                            basicEditForm: false
                        })
                    }}
                    onSuccess={ct => {
                        this.setState({
                            basicEditForm: false,
                            notifyText: "Content Type Saved Successfully !"
                        })
                    }}
                    />
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        contentTypes: state.CONTENT.contentTypes
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(ContentType));