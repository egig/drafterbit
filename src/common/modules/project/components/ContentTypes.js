import React from 'react';
import ProjectLayout from '../components/ProjectLayout';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ContentTypes extends React.Component {

	componentDidMount() {
		this.props.getContentTypes(this.props.project.id);
	}

	render() {

		return (
			<ProjectLayout title="Content Types">
				<div className="row justify-content-center">
					<div className="col-12">
						<Link to={`/project/${this.props.project.id}/content_types/new`} className="btn btn-success">Add Content Type</Link>
						<table className="table">
							<thead>
								<tr>
									<th>Name</th>
								</tr>
							</thead>
							<tbody>
							{this.props.contentTypes.map((ct,i) => {
								return (
									<tr key={i}>
										<td><Link to={`/project/${this.props.project.id}/content_types/${ct.id}`}>{ct.name}</Link></td>
									</tr>
								)
							})}
							</tbody>
						</table>
					</div>
				</div>
			</ProjectLayout>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		project: state.project.project,
		contentTypes: state.project.contentTypes,
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentTypes);