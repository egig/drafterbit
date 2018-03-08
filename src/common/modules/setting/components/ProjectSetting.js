import React from 'react';
import ProjectLayout from '../../project/components/ProjectLayout';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ProjectSetting extends React.Component {

	render() {

		return (
			<ProjectLayout title="Api Keys">
				<div className="row">
					<div className="col-6">
						<h3>Project Detail</h3>
						<form>
							<div className="form-group">
								<label htmlFor="project_name">Name</label>
								<input className="form-control" type="text" name="project_name" value={this.props.project.name}/>
							</div>
							<div className="form-group">
								<label htmlFor="project_description">Description</label>
								<textarea className="form-control" name="project_description" value={this.props.project.description}/>
							</div>
							<div className="form-group">
								<button type="submit" className="btn btn-primary">Save</button>
							</div>
						</form>
						<h3>Shutdown Project</h3>
						<div>
							<p>Your data will be permanently deleted. This action cannot be undone.</p>
							<a href="#" className="btn btn-danger">Shutdown Project</a>
						</div>
					</div>
				</div>
			</ProjectLayout>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		project: state.project.project,
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSetting);