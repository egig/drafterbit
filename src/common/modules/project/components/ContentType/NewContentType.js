import React from 'react';
import ProjectLayout from '../../components/ProjectLayout';
import { Link } from 'react-router-dom';
import actions from '../../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from '../../../../components/Modal';

class NewContentType extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fieldDialogActive: false
		}
	}

	render() {

		return (
			<ProjectLayout title={`New Content Type `}>
				<div className="row">
					<div className="col-6">
						<form>
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
								<div>
									<button onClick={e => {
										e.preventDefault();
										this.setState({
											fieldDialogActive: true
										})
									}} className="btn btn-success btn-sm"><i className="icon-plus"/> Add Field</button>
								</div>
							</div>
							<div className="form-group">
								<button className="btn btn-success">Save</button>
							</div>
						</form>
					</div>
				</div>
				<Modal isActive={this.state.fieldDialogActive}>
					<div>
						<form>
							<h4>Add Field</h4>
							<div className="form-group">
								<label htmlFor="label">Label</label>
								<input type="text" className="form-control" name="label"/>
							</div>
							<div className="form-group">
								<label htmlFor="name">Name</label>
								<input type="text" className="form-control" name="name"/>
							</div>
							<div className="form-group">
								<label htmlFor="type">Type</label>
								<select className="form-control">
									<option>Short Text</option>
									<option>Long Text</option>
								</select>
							</div>
							<button className="btn btn-success">Add Field</button>&nbsp;
							<button onClick={e => {e.preventDefault(); this.setState({fieldDialogActive: false}) }} className="btn btn-light">Cancel</button>
						</form>
					</div>
				</Modal>
			</ProjectLayout>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		contentType: state.project.contentType,
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewContentType);