import React from 'react';
import Layout from '../../common/components/Layout';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Notify from '../../../components/Notify';
import Card from '../../../components/Card/Card';
import { getFieldTypeName } from '../../../../fieldTypes';
import { Row, Col, Modal, ModalBody } from 'reactstrap';
import AddFieldForm from './AddFieldForm';

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
	        fieldTypeSelected: null
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            _id: nextProps.contentType._id,
            name: nextProps.contentType.name,
            slug: nextProps.contentType.slug,
            description: nextProps.contentType.description,
            fields: nextProps.contentType.fields
        });
    }

    componentDidMount() {
        this.props.getContentType(this.props.match.params.content_type_id);
    }

    addField(f) {
        this.setState({
            fields: this.state.fields.concat([f]),
            fieldDialogActive: false
        }, () => {

            this.props.updateContentType(
                this.state._id,
                this.state.name,
                this.state.slug,
                this.state.description.value,
                this.state.fields
            ).then(r => {
                this.setState({
                    notifyText: 'Fields successfully saved.'
                });
            });
        });
    }

    deleteContentType(deleteForm) {
        // TODO create alert
        this.props.deleteContentType(deleteForm.id.value)
            .then(r => {
                this.props.history.push('/content_types');
            });
    }

    onSubmit(form) {
        this.props.updateContentType(
            this.state._id,
            form.name.value,
            form.slug.value,
            form.description.value
        ).then(r => {
            this.setState({
                notifyText: 'Content type successfully saved.'
            });
        });
    }

    render() {

        return (
            <Layout>
	            <Row>
		            <Col md="4" className="mb-3">
			            <Card headerText={`Edit Content Type : ${this.props.contentType.name}`}>
				            <form onSubmit={e => {
                                e.preventDefault();
                                this.onSubmit(e.target);
                            }}>
					            <div className="form-group">
						            <label>Name</label>
						            <input onChange={e => {
                                        this.setState({name: e.target.value});
                                    }} className="form-control" type="text" name="name" id="name" value={this.state.name} />
					            </div>
					            <div className="form-group">
						            <label>Slug</label>
						            <input onChange={e => {
                                        this.setState({slug: e.target.value});
                                    }} className="form-control" type="text" name="slug" id="slug"  value={this.state.slug} />
					            </div>
					            <div className="form-group">
						            <label>Description</label>
						            <input onChange={e => {
                                        this.setState({description: e.target.value});
                                    }} className="form-control" type="text" name="description" id="description"  value={this.state.description} />
					            </div>
					            <div className="form-group">
						            <button type="submit" className="btn btn-success">Save</button>
					            </div>
				            </form>
			            </Card>
			            <div className="mb-3" />

			            <Card headerText={`Delete Content Type : ${this.props.contentType.name}`}>
				            <form onSubmit={e => { e.preventDefault(); this.deleteContentType(e.target); }}>
					            <input type="hidden" name="id" id="id" value={this.state._id} />
					            <button type="submit" className="btn btn-danger">Delete Content Type</button>
				            </form>
			            </Card>
			            <div className="mb-3" />
		            </Col>
		            <Col md="8">
			            <Card headerText="Fields">
					            <button onClick={e => {
                                e.preventDefault();
                                this.setState({
                                    fieldDialogActive: true
                                });
                            }} className="btn btn-success btn-sm mb-2"><i className="icon-plus"/> Add Field</button>
				            <table className="table table-sm table-bordered">
					            <thead>
					            <tr>
						            <th>Name</th>
						            <th>Type</th>
					            </tr>
					            </thead>
					            <tbody>
					            {this.state.fields.map((f,i) => {
						            return (
							            <tr key={i}>
								            <td>{f.name}</td>
								            <td>{getFieldTypeName(f.type_id)}</td>
							            </tr>
						            );
					            })}
					            </tbody>
				            </table>
			            </Card>
		            </Col>
	            </Row>
	            <Modal isOpen={this.state.fieldDialogActive}>
		            <ModalBody>
			            <AddFieldForm
				            onSubmit={e => {
	                            e.preventDefault();
	                            let form = e.target;

	                            let field = {
	                                name: form.name.value,
	                                label: form.label.value,
	                                type_id: form.type.value
	                            };

	                            if(_.includes([4,5], parseInt(this.state.fieldTypeSelected))) {
	                              field['related_content_type_id'] = form.related_content_type_id.value;
	                            }

	                            this.addField(field);

	                            form.reset();
	                        }}
				            onTypeChange={e => {
		                              this.setState({
		                                fieldTypeSelected: e.target.value
		                              });
		                            }}
				            fieldTypeSelected={this.state.fieldTypeSelected}
				            onCancel={e => {e.preventDefault(); this.setState({fieldDialogActive: false}); }}

			            />
		            </ModalBody>
	            </Modal>
                {this.state.notifyText &&
                  <Notify type="success" message={this.state.notifyText} />
                }
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        contentType: state.CONTENT_TYPE.contentType,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentType);