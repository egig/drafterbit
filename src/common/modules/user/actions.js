import axios from 'axios';
import config from '../../../../config';

const getUserListSuccess = function getUserListSuccess(data) {

	return {
		type: 'USER_GET_LIST_SUCCESS',
		payload: data
	}
};

exports.getUserList = function getUserList() {
	return dispatch => {

		let serviceURL = `/api/user/list`;
		return axios.get(serviceURL)
			.then(response => {
				dispatch(getUserListSuccess(response.data));
			})
	}
};