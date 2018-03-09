import React from 'react';
import ProjectLayout from './ProjectLayout';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
class ProjectDashboard extends React.Component {

	render() {

		return (
			<ProjectLayout title="Project Dashboard">
				<div className="row justify-content-center">
					{!this.props.project.content_types.length &&
						<div className="col-6">
							<p>There is no content type yet :(</p>
							<Link to={`/project/${this.props.project.id}/content_types/new`} className="btn btn-success">Create Content Type</Link>
						</div>
					}
				</div>
			</ProjectLayout>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		project: state.project.project
	}
};

export default connect(mapStateToProps)(ProjectDashboard);