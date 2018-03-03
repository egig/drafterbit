import React from 'react';
import ProjectLayout from './ProjectLayout';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ProjectDashboard extends React.Component {

	componentDidMount(){
		//TODO check if this is server-preloaded
		this.props.getProject(this.props.match.params.project_id);
	}

	render() {

		return (
			<ProjectLayout title="Project Dashboard">
				<div className="row justify-content-center">
				</div>
			</ProjectLayout>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		project: state.project.project
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDashboard);