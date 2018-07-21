import axios from 'axios';
import apiClient from '../../../apiClient';

const setUser = (user) => {
    return {
        type: 'AUTH_SET_USER',
        payload: user
    };
};

const doLogin = (email, password) => (dispatch) => {

    return axios.post('/login', {
        email,
        password
    }).then(response => {
        return dispatch(setUser(response.data));
    });
};

const register = (first_name, last_name, email, password) => (dispatch) => {

	return apiClient.createClient({})
		.createUser(first_name, last_name, email, password)
		.then(response => {
			return;
			// return dispatch(setUser(response.data));
		});
};

export default {
    doLogin, register
};