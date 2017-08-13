import React from 'react';
import { connect } from 'react-redux';
import UserIndex from './components/UserIndex';
import { bindActionCreators } from 'redux';
import actions from './actions';

const mapStateToProps = function mapStateToProps(state) {

	return {
		users: state.user.users
	}
};

const mapDispatchToProps = function (dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	}
};

export default connect(mapStateToProps, mapDispatchToProps);