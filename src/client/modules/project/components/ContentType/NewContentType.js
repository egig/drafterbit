const React = require('react');
import ProjectLayout from '../ProjectLayout';
import { Link } from 'react-router-dom';
import actions from '../../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from '../../../../components/Modal';
import Card from '../../../../components/Card/Card';

class NewContentType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldDialogActive: false,
            fields: []
        };
    }

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
            this.props.project._id,
            this.state.fields
        );
    }

    render() {

        return (
            <ProjectLayout>
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
                {this.state.fieldDialogActive &&
					<Modal>
					    <div>
					        <form onSubmit={e => {
					            e.preventDefault();
					            let form = e.target;
					            this.addField({
					                name: form.name.value,
					                label: form.label.value,
					                type_id: form.type.value
					            });

					            form.reset();
					        }}>
					            <h4>Add Field</h4>
					            <div className="form-group">
					                <label htmlFor="label">Label</label>
					                <input type="text" className="form-control" name="label" id="label"/>
					            </div>
					            <div className="form-group">
					                <label htmlFor="name">Name</label>
					                <input type="text" className="form-control" name="name" id="name"/>
					            </div>
					            <div className="form-group">
					                <label htmlFor="type">Type</label>
					                <select className="form-control" id="type">
					                    <option value="1">Short Text</option>
					                    <option value="2">Long Text</option>
					                    <option value="3">Rich Text</option>
					                </select>
					            </div>
					            <button className="btn btn-success">Add Field</button>&nbsp;
					            <button onClick={e => {e.preventDefault(); this.setState({fieldDialogActive: false}); }} className="btn btn-light">Cancel</button>
					        </form>
					    </div>
					</Modal>
                }
            </ProjectLayout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        project: state.project.project,
        contentType: state.project.contentType
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewContentType);