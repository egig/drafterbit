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

	render() {

		return (
			<ProjectLayout title={`Content Type: ${this.props.contentType.name}`}>
				<div className="row justify-content-center">
					<div className="col-12">
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
		contentType: state.project.contentType,
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentType);