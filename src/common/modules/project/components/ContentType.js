import React from 'react';
import ProjectLayout from '../components/ProjectLayout';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ContentType extends React.Component {

	componentDidMount() {
		this.props.getContentType(this.props.match.params.content_type_id);
	}

	deleteContentType(deleteForm) {
		// TODO create alert
		this.props.deleteContentType(deleteForm.id.value)
			.then(r => {
				this.props.history.push(`/project/${this.props.project.id}/content_types`);
			})
	}

	render() {

		return (
			<ProjectLayout title={`Content Type: ${this.props.contentType.name}`}>
				<div className="row justify-content-center">
					<div className="col-12">
						<form onSubmit={e => { e.preventDefault(); this.deleteContentType(e.target); }}>
							<input type="hidden" name="id" id="id" value={this.props.contentType.id} />
							<button type="submit" className="btn btn-danger">Delete Content Type</button>
						</form>
						<h2>Fields</h2>
						<table className="table">
							<thead>
							<tr>
								<th>Name</th>
								<th>Type</th>
							</tr>
							</thead>
							<tbody>
							{this.props.contentType.fields.map((f,i) => {
								return (
									<tr key={i}>
										<td>{f.name}</td>
										<td>{f.type}</td>
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
		contentType: state.project.contentType,
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentType);