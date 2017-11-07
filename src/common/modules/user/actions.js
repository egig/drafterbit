import axios from 'axios';

const setUser = (user) => {
	return {
		type: 'AUTH_SET_USER',
		payload: user
	}
};

const doLogin = (email, password) => (dispatch) => {

	axios.post('/api/user/login', {
		email,
		password
	}).then(user => {
		dispatch(setUser(user));

	})
};

export default {
	doLogin
}