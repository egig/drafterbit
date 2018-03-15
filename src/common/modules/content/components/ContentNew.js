import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators } from 'redux';
import actions from '../actions';
import ProjectLayout from '../../project/components/ProjectLayout';

class ContentNew extends React.Component {

	componentDidMount() {
		let projectId  = this.props.match.params.project_id;
		let slug  = this.props.match.params.content_type_slug;
		this.props.getContentTypeFields(projectId, slug);
	}

	render() {
		return (<ProjectLayout>
			test
		</ProjectLayout>);
	}
}

const mapStateToProps = (state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentNew);