import React from 'react';
import ProjectLayout from '../../project/components/ProjectLayout';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TableA from '../../../components/Table/TableA';

class ApiKeys extends React.Component {

	componentDidMount() {
		this.props.getApiKeys(this.props.project.id);
	}

	render() {

		let columns = [
			{
				label: "Name",
				accessor: "name",
				render: (a) => {
					return <Link to={`/project/${this.props.project.id}/api_keys/${a.id}/edit`}>{a.name}</Link>;
				}
			},
			{
				label: "Key",
				accessor: "key"
			}
		];

		return (
			<ProjectLayout title="Api Keys">
				<Link className="btn btn-success" to={`/project/${this.props.project.id}/api_keys/new`}>Create Api Key</Link>
				<div className="row justify-content-center">
					<div className="col-12">
						<TableA columns={columns} data={this.props.apiKeys} />
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