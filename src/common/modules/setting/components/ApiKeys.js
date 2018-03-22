import React from 'react';
import ProjectLayout from '../../project/components/ProjectLayout';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ApiKeys extends React.Component {

	componentDidMount() {
		this.props.getApiKeys(this.props.project.id);
	}

	render() {

		return (
			<ProjectLayout title="Api Keys">
				<Link className="btn btn-success" to={`/project/${this.props.project.id}/api_keys/new`}>Create Api Key</Link>
				<div className="row justify-content-center">
					<div className="col-12">
						<table className="table">
							<thead>
							<tr>
								<th>Name</th>
								<th>Key</th>
							</tr>
							</thead>
							<tbody>
							{this.props.apiKeys.map((a,i) => {
								return (
									<tr key={i}>
										<td><Link to={`/project/${this.props.project.id}/api_keys/${a.id}`}>{a.name}</Link></td>
										<td>{a.key}</td>
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
		apiKeys: state.project.apiKeys,
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeys);