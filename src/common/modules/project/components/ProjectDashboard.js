import React from 'react';
import ProjectLayout from './ProjectLayout';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import drafterbit from 'drafterbit';


class ProjectDashboard extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			contentTypeStat: []
		}
	}

	componentDidMount() {
		let client  = drafterbit.createClient({});
		client.getProjectStat(this.props.match.params.project_id)
			.then(r => {
				this.setState({
					contentTypeStat: r.content_type
				});
			})
	}

	render() {

		return (
			<ProjectLayout title="Project Dashboard">
					{!this.props.project.content_types.length &&
					<div className="row justify-content-center">
						<div className="col-6">
							<p>There is no content type yet :(</p>
							<Link to={`/project/${this.props.project.id}/content_types/new`} className="btn btn-success">Create Content Type</Link>
						</div>
					</div>
					}

				<div className="row">
					<div>
							{this.state.contentTypeStat.map((item,i) => {
								return <p key={i}>{item.name } : {item.content_count}</p>
							})}
						</div>
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