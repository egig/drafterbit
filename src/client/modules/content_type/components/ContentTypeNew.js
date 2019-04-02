import React from 'react';
import Layout from '../../common/components/Layout';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, ModalBody } from 'reactstrap';
import Card from '../../../components/Card/Card';
import _ from 'lodash';
import AddFieldForm from './AddFieldForm';

// TODO create blank content type instead and save as draft
class ContentTypeNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldDialogActive: false,
            fields: [],
	        fieldTypeSelected: null
        };
    }

    componentDidMount() {
        this.props.getContentTypes();
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    // 	if(prevProps.project['_id'] !=  this.props.project._id) {
    // 		this.props.getContentTypes(this.props.project._id);
    // 	}
    // }

    addField(f) {
        this.setState({
            fields: this.state.fields.concat([f]),
            fieldDialogActive: false
        });
    }

    onSubmit(form) {
        this.props.createContentType(
            form.name.value,
            form.slug.value,
            form.description.value,
            this.state.fields
        );
    }

    render() {

        return (
            <Layout>
                <div className="row">
                    <div className="col-6">
                        <Card headerText="New Content Type" >
                            <form onSubmit={e => {
                                e.preventDefault();
                                this.onSubmit(e.target);
                            }}>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" className="form-control" name="name"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="slug">Slug</label>
                                    <input type="text" className="form-control" name="slug"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <textarea className="form-control" name="description"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Fields</label>
                                    {!!this.state.fields.length &&
                                        <ul>
                                            {this.state.fields.map((f,i) => {
                                                return (<li>{f.name}</li>);
                                            })}
                                        </ul>
                                    }
                                    <div>
                                        <button onClick={e => {
                                            e.preventDefault();
                                            this.setState({
                                                fieldDialogActive: true
                                            });
                                        }} className="btn btn-success btn-sm"><i className="icon-plus"/> Add Field</button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-success">Save</button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
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
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
	    contentType: state.CONTENT_TYPE.contentType,
	    contentTypes: state.CONTENT_TYPE.contentTypes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentTypeNew);